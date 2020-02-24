#return json to user that displays each story with its associated questions.
#allow user to submit post requests to edit this data to their liking
import flask
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

    cursor = connection.execute("SELECT * FROM formdata")

    for row in cursor.fetchall():
        storyid = str(row['storyid'])
        questionText = row['questiontext']
        #check if not a repeat question before adding to list (ex/ multiple docs in one story share questions)
        if questionText not in context[storyid]["Questions"]:
            context[storyid]["Questions"].append(questionText)


    return flask.jsonify(**context)


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["GET"])
def get_story(storyid):
    #get info for particular story given its storyid

    context = {}
    connection = timelineApp.model.get_db()

    cursor = connection.execute("SELECT * FROM stories WHERE storyid = ?", (storyid,))

    for row in cursor.fetchall():
    	storyname = row['storyname']
    	context[storyname] = []

    cursor = connection.execute("SELECT * FROM formdata WHERE storyid = ?", (storyid,))

    for row in cursor.fetchall():
    	questionText = row['questiontext']
    	context[storyname].append(questionText)


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


@timelineApp.app.route('/api/stories/', methods=["DELETE"])
def delete_story():
    """Delete story from list of stories."""
    connection = timelineApp.model.get_db()
    context = {}
    context['text'] = flask.request.get_json(force=True)['text']  #this is name of story we delete
    #delete story from database
    connection.execute(
    	"DELETE FROM stories where "
    	"storyname = ? ",
    	(context['text'],)
    )

  	#main action of delete has been done, now just return a 204 code
    rsp = flask.Response(response="", status=204, mimetype="application/json")
    return rsp


@timelineApp.app.route('/api/stories/<int:storyid>/', methods=["POST"])
def add_question_to_story(storyid):
    """Add question to all docs in a given story."""
    connection = timelineApp.model.get_db()
    context = {}

    context['text'] = flask.request.get_json(force=True)['text']

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
    	    "INSERT INTO formdata(storyid, documentid, questiontext, answertext) "
    	    "VALUES (?, ?, ?, ?) ",
    	    (storyid, docID, context['text'], "")
        )

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
    	"DELETE FROM formdata where "
    	"storyid = ? and questiontext = ?",
    	(storyid, context['text'])
    )

  	#main action of delete has been done, now just return a 204 code
    rsp = flask.Response(response="", status=204, mimetype="application/json")
    return rsp
