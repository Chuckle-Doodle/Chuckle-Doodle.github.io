import timelineApp
from timelineApp.config import UPLOAD_FOLDER
import flask
from flask import request
import os
from distutils.dir_util import copy_tree
import json
import datetime
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


#TODO FINISH EXPORT FUNCTION THEN DO IMPORT !!!!!!
@timelineApp.app.route('/api/stories/export/', methods=["POST"])
def export_story():
    """Export all data for this particular story as JSON file."""
    if "username" not in flask.session:
        return "No user signed in. Unable to export story." 
    username = flask.session['username']

    storyname = flask.request.form['stories']
    if storyname == None:
        return "ERROR: Select a valid story to export."

    connection = timelineApp.model.get_db()
    context = {}
    context['Title'] = storyname
    context['Questions'] = []
    context['Documents'] = {}
    context['Documents']['Files'] = []
    context['Documents']['Images'] = []
    context['ExportedBy'] = username
    context['ExportedTime'] = str(datetime.datetime.now())

    #get storyid for this story
    storyid = connection.execute("SELECT storyid FROM stories WHERE username = ? and storyname = ?", (flask.session['username'], storyname)).fetchone()['storyid']

    #we have username and storyname, so query database to get all data for this story to then export it as json

    #need full paths to both documents and images
    fullPathToDocs = os.path.join(UPLOAD_FOLDER, 'users', username, 'stories', storyname, 'documents')
    fullPathToImages = os.path.join(UPLOAD_FOLDER, 'users', username, 'stories', storyname, 'images')

    docs = connection.execute("SELECT * FROM documents WHERE username = ? and storyid = ?", (flask.session['username'], storyid)).fetchall()
    for doc in docs:
        docPath = os.path.join(fullPathToDocs, doc['filename'])
        imagePath = os.path.join(fullPathToImages, doc['frontcover'])
        context['Documents']['Files'].append(docPath)
        context['Documents']['Images'].append(imagePath)
        #only need this documentid variable to store docid of last document in this list
        documentid = doc['documentid']

    questions = connection.execute("SELECT questiontext FROM formquestions WHERE username = ? and storyid = ? and documentid = ?", (flask.session['username'], storyid, documentid)).fetchall()
    for q in questions:
        context['Questions'].append(q['questiontext'])


    #save context dictionary to disk as json file (with friendly print style) to then be exported
    ##save to UPLOAD_FOLDER/exportedStories/ directory

    #store current working directory to return to this at end of function
    initialPath = os.getcwd()

    tempPath = os.path.join(UPLOAD_FOLDER, 'exportedStories')
    os.chdir(tempPath)   

    fileName = storyname + '.json'
    with open(fileName, 'w') as file:
        json_string = json.dumps(context, default=lambda o: o.__dict__, sort_keys=True, indent=2)
        file.write(json_string)


    os.chdir(initialPath)
    # after exporting story, return back to the welcome screen
    return flask.redirect(flask.url_for('show_index'))


#TODO FINISH THIS FUNCTION !!!!!! 5/20

@timelineApp.app.route('/api/stories/import/', methods=["POST"])
def import_story():

    if "username" not in flask.session:
        return "No user signed in. Unable to import story."

    #get storyname to be imported
    storyname = flask.request.form['importableStories']
    if storyname == None:
        return "ERROR: Select a valid story to import."

    initialPath = os.getcwd()
    #go to UPLOAD_FOLDER/exportedStories/<storyname> to retrieve data for the story we're importing
    filePath = os.path.join(UPLOAD_FOLDER, 'exportedStories')
    os.chdir(filePath)
    fileName = storyname + '.json'
    with open(fileName) as json_file:
        data = json.load(json_file)

    # storyTitle = data['Title']
    storyQuestions = data['Questions']
    storyFiles = data['Documents']['Files']
    storyImages = data['Documents']['Images']
    numberDocuments = len(storyFiles)

    connection = timelineApp.model.get_db()

    #get max storyid in database currently for this user. make new story one greater than this.
    storyid = connection.execute("SELECT MAX(storyid) from stories WHERE username = ?", (flask.session['username'],)).fetchone()['MAX(storyid)']
    if storyid == None:
        storyid = 1
    else:
        storyid = storyid + 1

    #populate database with this new story for this user
    #title
    connection.execute("INSERT INTO stories(storyid, username, storyname) VALUES (?, ?, ?)", (storyid, flask.session['username'], storyname))

    #documents
    index = 1
    for file, image in zip(storyFiles, storyImages):
        filename = file.rsplit("/", 1)[-1]
        frontcover = image.rsplit("/", 1)[-1]
        connection.execute("INSERT INTO documents(documentid, storyid, username, filename, frontcover) VALUES (?, ?, ?, ?, ?)", (index, storyid, flask.session['username'], filename, frontcover))
        index = index + 1

    #questions
    #did i handle questionid correctly here??? 
    for docid in range(1, numberDocuments + 1):
        for idx, question in enumerate(storyQuestions):
            connection.execute("INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) VALUES(?, ?, ?, ?, ?)", (idx + 1, docid, storyid, flask.session['username'], question))


    #add story to the file system under this user's directory
    ## example: copy entire "Black_Death" directory from user: test to current user
    #TODO: NEED TO EDIT PATH OF DIRECTORY WHERE FILE IS BEING COPIED TO CAPTURE STORY NAME! RIGHT NOW THERES AN ISSUE
    sourceDirectory = storyFiles[0].rsplit("/", 2)[0]
    destinationDirectory = os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', storyname)
    os.mkdir(destinationDirectory)
    copy_tree(sourceDirectory, destinationDirectory)

    os.chdir(initialPath)
    # after importing story, return back to the welcome screen with this story as an available option to study
    return flask.redirect(flask.url_for('show_index'))
