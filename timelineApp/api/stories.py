#return json to user that displays each story with its associated questions.
#allow user to submit post requests to edit this data to their liking
import flask
from flask import request
import timelineApp


@timelineApp.app.route('/api/stories/', methods=["GET"])
def get_stories():
    #go into database to retrieve the story and question data, bundle it into a dict, then return it

    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT * FROM stories")

    for row in cursor.fetchall():
    	storyname = row['storyname']
    	storyid = str(row['storyid'])
    	context[storyid] = {}
    	context[storyid]["Story Name"] = storyname
    	context[storyid]["Questions"] = []

    #now each storyname is associated with list, we need to populate these lists with list of questions pertaining to each story.
    #so, query questions database now

    cursor = connection.execute("SELECT * FROM formquestions")

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

    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT storyname FROM stories WHERE storyid = ?", (storyid,))

    storyname = cursor.fetchone()['storyname']
    context["Story"] = storyname
    context["Documents"] = []
    #context["Timeline1Dates"] = []
    #context["Timeline2Dates"] = []


    #get number of documents for this story
    cursor = connection.execute("SELECT COUNT(*) FROM documents WHERE storyid = ?", (storyid,))
    numberDocuments = cursor.fetchone()['COUNT(*)']

    for i in range(numberDocuments):
        docData = {}
        docData["FormDataQuestions"] = []
        docData["FormDataAnswers"] = []
        context["Documents"].append(docData)

    #get filenames for each doc
    cursor = connection.execute("SELECT filename, frontcover, documentid FROM documents WHERE storyid = ?", (storyid,))
    for row in cursor.fetchall():
        docid = row['documentid']
        context["Documents"][int(docid) - 1]["Filename"] = row['filename']
        context["Documents"][int(docid) - 1]["Frontcover"] = "/static/images/" + row['frontcover']
        context["Documents"][int(docid) - 1]["docID"] = docid


    #get questions and answers for each doc in this story
    #cursor = connection.execute("SELECT * FROM formdata WHERE storyid = ?", (storyid,))

    #for row in cursor.fetchall():
    #    questionText = row['questiontext']
    #    answerText = row['answertext']
    #    docid = row['documentid']
    #    context["Documents"][int(docid) - 1]["FormDataQuestions"].append(questionText)
    #    context["Documents"][int(docid) - 1]["FormDataAnswers"].append(answerText)

    cursor = connection.execute("SELECT * FROM formquestions WHERE storyid = ?", (storyid,))
    questionRows = cursor.fetchall()
    #get questionIDs of questionRows data
    for question in questionRows:
        questionText = question['questiontext']
        docid = question['documentid']
        cursor2 = connection.execute("SELECT answertext FROM formanswers WHERE questionid = ? and username = ?", (question['questionid'],username))
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
    connection = timelineApp.model.get_db()
    context = {}
    #print("********")
    #print(flask.request.get_json(force=True))
    #print(type(flask.request.get_json(force=True)))
    #print("********")
    context['text'] = flask.request.get_json(force=True)['text']   #this variable now holds the storyname to add
    #print(context['text'])
    #query database to find out what storyid of new story should be (one more than current highest ID #)
    #cur = connection.execute(
    #    "SELECT last_insert_rowid() FROM stories;"
    #)
    cur = connection.execute(
    	"SELECT storyid from stories where storyid = "
    	"(SELECT MAX(storyid) from stories) "
    )


    storyid = int(cur.fetchone()["storyid"]) + 1
    #print("storyid is: ", storyid)

    #add story to database
    connection.execute(
    	"INSERT INTO stories(storyid, storyname) "
    	"VALUES (?, ?) ",
    	(storyid, context['text'])
    )

    return flask.jsonify(**context), 201


@timelineApp.app.route('/api/stories/delete/', methods=["POST", "DELETE"])
def delete_story():
    """Delete story from list of stories."""
    connection = timelineApp.model.get_db()
    context = {}
    context['text'] = flask.request.form['stories']
    #delete story from database
    connection.execute(
    	"DELETE FROM stories where "
    	"storyname = ? ",
    	(context['text'],)
    )

  	#main action of delete has been done, now just return a 204 code
    #rsp = flask.Response(response="", status=204, mimetype="application/json")
    #return rsp

    # reload welcome screen now without the deleted story
    return flask.redirect(flask.url_for('show_index'))


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["POST"])
def add_question_to_story(storyid):
    """Add question to all docs in a given story."""
    connection = timelineApp.model.get_db()
    context = {}
    context['text'] = request.form['text']
    ##print(flask.request.get_json(force=True))

    #UPDATE 4/19 - DONT THINK WE NEED THIS ANYMORE
    #set questionID of new question to be one greater than highest questionID of that story
    #cur = connection.execute(
    #    "SELECT questionid from formquestions where storyid = ? and questionid = "
    #    "(SELECT MAX(questionid) from formquestions) ", (storyid,)
    #)


    #questionid = int(cur.fetchone()["questionid"]) + 1



    #get the documentIDs that correspond with this story
    docIDs = []
    cursor = connection.execute(
    	"SELECT documentid from documents where storyid = ?", (storyid,)
    )
    for row in cursor.fetchall():
    	docIDs.append(row['documentid'])

    #add question to database (for all docs within this story!)
    for docID in docIDs:
        connection.execute(
            "INSERT INTO formquestions(storyid, documentid, questiontext) "
    	    "VALUES (?, ?, ?) ",
    	    (storyid, docID, context['text'])
        )

    #RETURN SOMETHING ELSE HERE !
    return flask.jsonify(**context), 201


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["DELETE"])
def delete_question_from_story(storyid):
    """Delete question from all docs in story's list of questions."""
    connection = timelineApp.model.get_db()
    context = {}

    context['text'] = flask.request.get_json(force=True)['text']

    #get the documentIDs that correspond with this story
    #docIDs = []
    #cursor = connection.execute(
    #	"SELECT documentid from documents where storyid = ?", (storyid)
    #)
    #for row in cursor.fetchall():
    #	docIDs.append(row['documentid'])

    #delete question from database for each docID in this story
    connection.execute(
    	"DELETE FROM formquestions where "
    	"storyid = ? and questiontext = ?",
    	(storyid, context['text'])
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

    #for row in cursor.fetchall():
    #    questiontext = row['questiontext']
    #    answertext = row['answertext']
    #    context[questiontext] = answertext


    return flask.jsonify(**context)

"""
@timelineApp.app.route('/api/stories/<int:storyid>/<int:documentid>/', methods=["POST"])
def update_form_data_for_doc_in_story(storyid, documentid):
    # on submit in pdf screen, update database with updated user input for given document
    connection = timelineApp.model.get_db()
    context = {}


    print(request.form['2'])
    print(request.form['1'])


    #context['text'] = request.form['text']
    ##print(flask.request.get_json(force=True))
    #set questionID of new question to be one greater than highest questionID of that story
    cur = connection.execute(
        "SELECT questionid from formdata where storyid = ? and questionid = "
        "(SELECT MAX(questionid) from formdata) ", (storyid,)
    )


    questionid = int(cur.fetchone()["questionid"]) + 1

    #get the documentIDs that correspond with this story
    docIDs = []
    cursor = connection.execute(
        "SELECT documentid from documents where storyid = ?", (storyid,)
    )
    for row in cursor.fetchall():
        docIDs.append(row['documentid'])

    #add question to database (for all docs within this story!)
    for docID in docIDs:
        connection.execute(
            "INSERT INTO formdata(storyid, documentid, questionid, questiontext, answertext) "
            "VALUES (?, ?, ?, ?, ?) ",
            (storyid, docID, questionid, context['text'], "")
        )

    return flask.jsonify(**context), 201
"""

