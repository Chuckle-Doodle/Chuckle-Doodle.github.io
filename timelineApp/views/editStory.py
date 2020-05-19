import flask
import timelineApp
from timelineApp.config import UPLOAD_FOLDER
from pdf2image import convert_from_path
import os
from werkzeug.utils import secure_filename


@timelineApp.app.route('/editStory/', methods=['GET', 'POST'])
def edit_story():

    #check if user is signed in. if not go back to login screen
    if "username" in flask.session:
        context['username'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

    #store current working directory to return to this at end.
    initialPath = os.getcwd()

    #setup context dict to be populated and connect to database.
    context = {}
    connection = timelineApp.model.get_db()


    #TODO NEXT! CONVERT THIS CODE FROM ADD STUFF TO EDIT STUFF

    #get which story is to be edited.
    originalStoryName = flask.request.form['storyToEdit']

    if (flask.request.method == 'POST'):

        #extract file objects for use later
        files = []
        for docid, file in flask.request.files.items():
            fname = secure_filename(file.filename)
            if len(fname) > 0:
                files.append(fname)

        numberDocuments = len(files)


        #extract question data from form for later
        questions = []
        for key, val in flask.request.form.items():
            if key == 'title':
                context['storyName'] = val
            else:
                if len(val) > 0:
                    questions.append(val)

        numberQuestions = len(questions)

        #check if story already exists for this user. if so, error. else, add it to stories table
        row = connection.execute("SELECT storyname from stories where storyname = ? and username = ? and storyname != ?", (context['storyName'], context['username'], originalStoryName)).fetchone()

        if row:
            #story already exists for this user! can't add it
            context['storyAlreadyExists'] = "A story with this name already exists for current user or the story name is blank. Please try again."
            return flask.render_template("addStory.html", **context)
        else:

            #update storyname in database
            connection.execute("UPDATE stories SET storyname = ? WHERE username = ? and storyname = ?", (flask.session['username'], originalStoryName))

            #get storyid from newly inserted story
        	#storyid = maxStoryId + 1


        i = 1
        tempPath = os.path.join(UPLOAD_FOLDER, context['username'])
        tempPath = os.path.join(tempPath, 'stories')
        tempPath = os.path.join(tempPath, context['name'])
        os.chdir(tempPath)
        #os.mkdir('documents')
        #os.mkdir('images')

        #save uploaded documents for this story into proper directory in file system
        while i <= numberDocuments:
            f = flask.request.files['document' + str(i)]
            filename = secure_filename(f.filename)
            updatedPath = os.path.join(tempPath, 'documents')
            pathToFile = os.path.join(updatedPath, filename)
            f.save(pathToFile)

            #extract frontcover from pdf
            pages = convert_from_path(pathToFile, 500)
            for page in pages:
            	os.chdir(os.path.join(tempPath, 'images'))
            	page.save('{}.jpg'.format(str(i)), 'JPEG')
            	break

            os.chdir(tempPath)

            #update record in documents table
            #connection.execute(
            #    "INSERT INTO documents(documentid, storyid, username, filename, frontcover) VALUES (?, ?, ?, ?, ?)", (i, storyid, context['username'], filename, '{}.jpg'.format(str(i)))
            #)
            connection.execute("UPDATE documents SET //// where ////")


            i = i + 1



        #update questions in database with new questions for this story
        questionIdCounter = 1
        docIdCounter = 1
        while docIdCounter <= numberDocuments:
            while questionIdCounter <= numberQuestions:
                #connection.execute(
                #    "INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) VALUES (?, ?, ?, ?, ?)", (questionIdCounter, docIdCounter, storyid, context['username'], questions[questionIdCounter - 1])
                #)
                connection.execute("UPDATE formquestions SET ")

                questionIdCounter += 1
            questionIdCounter = 1
            docIdCounter += 1


    ############  do below code if get request (also if post request? ...)  #################

    #get storyid in database for this particular story, for use in below queries
    storyId = connection.execute("SELECT storyid FROM stories where username = ? and storyname = ?", (flask.session['username'], context['storyName'])).fetchone()['storyid']

    #ensure storyId is a number, otherwise there's a problem
    if storyId == None:
        return "ERROR: the story that is going to be edited is not found in database!"


    #go to database to retrieve documents and questions currently stored for this story to populate editStory form with most recent data.
    context['storyDocuments'] = []
    context['storyQuestions'] = []

    docs = connection.execute("SELECT documentid, filename FROM documents where username = ? and storyid = ?", (flask.session['username'], storyId)).fetchall()
    for doc in docs:

        context['storyDocuments'].append(doc['filename']) #populate this dict with the names of each document file for this story


    questions = connection.execute("SELECT questiontext FROM formquestions where username = ? and storyid = ?", (flask.session['username'], storyId)).fetchall()
    for q in questions:
        context['storyQuestions'].append(q['questiontext'])



    #upon finishing, revert current working directory back to what it was initially
    os.chdir(initialPath)

    return flask.render_template("editStory.html", **context)