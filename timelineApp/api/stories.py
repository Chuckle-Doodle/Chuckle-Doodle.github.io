import flask
from flask import request
import timelineApp
import os
import shutil


@timelineApp.app.route('/api/stories/', methods=["GET"])
def get_stories():
    #go into database to retrieve the story and question data, bundle it into a dict, then return it
    if "username" not in flask.session:
        return "Unable to display data. Please first sign in."


    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT * FROM stories where username = ?", (flask.session['username'],))

    for row in cursor.fetchall():
    	storyname = row['storyname']
    	storyid = str(row['storyid'])
    	context[storyid] = {}
    	context[storyid]["Story Name"] = storyname
    	context[storyid]["Questions"] = []

    #now each storyname is associated with list, we need to populate these lists with list of questions pertaining to each story.
    #so, query questions database now

    cursor = connection.execute("SELECT * FROM formquestions where username = ?", (flask.session['username'],))

    for row in cursor.fetchall():
        storyid = str(row['storyid'])
        questionText = row['questiontext']
        #check if not a repeat question before adding to list (ex/ multiple docs in one story share questions)
        if questionText not in context[storyid]["Questions"]:
            context[storyid]["Questions"].append(questionText)


    return flask.jsonify(**context)


@timelineApp.app.route('/api/stories/<int:storyid>/<username>/', methods=["GET"])
def get_story(storyid, username):
    #get info for particular story given its storyid
    if "username" not in flask.session:
        return "Unable to display data. Please first sign in."

    #ensure user has access to this data
    if flask.session["username"] != username:
        return "User permission error."


    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT storyname FROM stories WHERE storyid = ? and username = ?", (storyid, flask.session['username']))

    storyname = cursor.fetchone()['storyname']
    context["Story"] = storyname
    context["Documents"] = []

    #get number of documents for this story
    cursor = connection.execute("SELECT COUNT(*) FROM documents WHERE storyid = ? and username = ?", (storyid, flask.session['username']))
    numberDocuments = cursor.fetchone()['COUNT(*)']

    for i in range(numberDocuments):
        docData = {}
        docData["FormDataQuestions"] = []
        docData["FormDataAnswers"] = []
        context["Documents"].append(docData)

    #get filenames for each doc
    cursor = connection.execute("SELECT filename, frontcover, documentid FROM documents WHERE storyid = ? and username = ?", (storyid, flask.session['username']))
    for row in cursor.fetchall():
        docid = row['documentid']
        context["Documents"][int(docid) - 1]["Filename"] = row['filename']
        context["Documents"][int(docid) - 1]["Frontcover"] = "/static/var/users/" + flask.session['username'] + "/stories/" + storyname + "/images/" + row['frontcover']
        context["Documents"][int(docid) - 1]["docID"] = docid

    cursor = connection.execute("SELECT * FROM formquestions WHERE storyid = ? and username = ?", (storyid, flask.session['username']))
    questionRows = cursor.fetchall()
    #get questionIDs of questionRows data
    for question in questionRows:
        questionText = question['questiontext']
        docid = question['documentid']
        cursor2 = connection.execute("SELECT answertext FROM formanswers WHERE questionid = ? and documentid = ? and storyid = ? and username = ?", (question['questionid'], docid, storyid, flask.session['username']))
        answerData = cursor2.fetchone()
        if answerData:
            answerText = answerData['answertext']
        else:
            answerText = ""
        context["Documents"][int(docid) - 1]["FormDataQuestions"].append(questionText)
        context["Documents"][int(docid) - 1]["FormDataAnswers"].append(answerText)


    # ***** Hardcode this view stuff in for now. ****** #
    #
    ##
    ###
    ####
    context['View'] = {}
    context['View']["Name"] = "Author View"
    context['View']["ReferenceViews"] = []
    view = {}
    view["Type"] = "Timeline"
    view["Question"] = "When occurred"
    context['View']["ReferenceViews"].append(view)

    view2 = {}
    view2["Type"] = "Timeline"
    view2["Question"] = "When written"
    context['View']["ReferenceViews"].append(view2)

    context['View']["Sort By:"] = "Author"

    # ************************************************** #

    return flask.jsonify(**context)


@timelineApp.app.route('/api/stories/', methods=["POST"])
def add_story():
    """Add story to list of stories. Make storyid one bigger than last inserted story."""
    if "username" not in flask.session:
        return "Unable to add to data. Please first sign in."

    connection = timelineApp.model.get_db()
    context = {}

    context['text'] = flask.request.get_json(force=True)['text']   #this variable now holds the storyname to add

    cur = connection.execute(
    	"SELECT storyid from stories where storyid = "
    	"(SELECT MAX(storyid) from stories) and username = ?", (flask.session['username'],)
    )


    storyid = int(cur.fetchone()["storyid"]) + 1

    #add story to database
    connection.execute(
    	"INSERT INTO stories(storyid, username, storyname) "
    	"VALUES (?, ?, ?) ",
    	(storyid, flask.session['username'], context['text'])
    )

    return flask.jsonify(**context), 201


@timelineApp.app.route('/api/stories/delete/', methods=["POST", "DELETE"])
def delete_story():
    """Delete story from list of stories."""
    if "username" not in flask.session:
        return "Unable to delete from data. Please first sign in."

    connection = timelineApp.model.get_db()
    context = {}
    context['text'] = flask.request.form['stories']
    #delete story from database
    connection.execute(
    	"DELETE FROM stories where "
    	"storyname = ? and username = ?",
    	(context['text'], flask.session['username'])
    )

    initialPath = os.getcwd()
    #delete data from story in file system
    newPath = "timelineApp/static/var/users/" + flask.session['username'] + "/stories"
    os.chdir(newPath)

    try:
        shutil.rmtree(context['text'])
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

    os.chdir(initialPath)
  	#main action of delete has been done, now just return a 204 code
    #rsp = flask.Response(response="", status=204, mimetype="application/json")
    #return rsp

    # reload welcome screen now without the deleted story
    return flask.redirect(flask.url_for('show_index'))


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["POST"])
def add_question_to_story(storyid):
    """Add question to all docs in a given story."""
    if "username" not in flask.session:
        return "Unable to add to data. Please first sign in."

    connection = timelineApp.model.get_db()
    context = {}
    context['text'] = request.form['text']

    #get number of questions for the docs that correspond with this story

    questionid = connection.execute(
    	"SELECT MAX(questionid) from formquestions where storyid = ? and username = ?", (storyid, flask.session['username'])
    ).fetchone()['MAX(questionid)'] + 1

    #get the docIDs that are associated with this story!
    docIDs = []
    rows = connection.execute(
        "SELECT documentid from documents where storyid = ? and username = ?", (storyid, flask.session['username'])
    ).fetchall()
    for row in rows:
        docIDs.append(row['documentid'])

    #add question to database (for all docs within this story!)
    for docID in docIDs:
        connection.execute(
            "INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) "
    	    "VALUES (?, ?, ?, ?, ?) ",
    	    (questionid, docID, storyid, flask.session['username'], context['text'])
        )

    #RETURN SOMETHING ELSE HERE !
    return flask.jsonify(**context), 201


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["DELETE"])
def delete_question_from_story(storyid):
    """Delete question from all docs in story's list of questions."""
    if "username" not in flask.session:
        return "Unable to delete from data. Please first sign in."

    connection = timelineApp.model.get_db()
    context = {}

    context['text'] = flask.request.get_json(force=True)['text']

    #delete question from database for each docID in this story
    connection.execute(
    	"DELETE FROM formquestions where "
    	"storyid = ? and questiontext = ? and username = ?",
    	(storyid, context['text'], flask.session['username'])
    )

  	#main action of delete has been done, now just return a 204 code
    rsp = flask.Response(response="", status=204, mimetype="application/json")
    return rsp


@timelineApp.app.route('/api/stories/<int:storyid>/<int:documentid>', methods=["GET"])
def get_questions_and_answers_for_doc_in_story(storyid, documentid):
    #get questions and answers for a particular document in a particular story

    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT questiontext FROM formquestions WHERE storyid = ? and documentid = ?", (storyid, documentid))
    questionRows = cursor.fetchall()

    for question in questionRows:
        cursor2 = connection.execute("SELECT answertext from formanswers WHERE questionid = ?", (question['questionid'],))
        answerText = cursor2.fetchone()['answertext']
        questionText = question['questiontext']
        context[questionText] = answerText

    return flask.jsonify(**context)

