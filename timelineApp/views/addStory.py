import flask
import timelineApp
from timelineApp.config import UPLOAD_FOLDER
from pdf2image import convert_from_path
import os
from werkzeug.utils import secure_filename


@timelineApp.app.route('/addStory/', methods=['GET', 'POST'])
def add_story_2():

    context = {}
	#ensure user is signed in before proceeding. else return user to login screen.
    if "username" in flask.session:
        context['username'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

	#store current working directory initially to return to it at end to prevent error
    initialPath = os.getcwd()

    #set up database connection
    connection = timelineApp.model.get_db()

    if (flask.request.method == 'POST'):

        #extract file objects for use later
        files = []
        for docid, file in flask.request.files.items():
            fname = secure_filename(file.filename)
            if len(fname) > 0:
                files.append(fname)

        # find out which form aka document this submission corresponds with
        numberDocuments = len(files)


        #extract question data from form for later
        questions = []
        for key, val in flask.request.form.items():
            if key == 'title':
                context['name'] = val
            else:
                if len(val) > 0:
                    questions.append(val)

        numberQuestions = len(questions)

        #check if story already exists for this user. if so, error. else, add it to stories table
        row = connection.execute("SELECT storyname from stories where storyname = ? and username = ?", (context['name'], context['username'])).fetchone()

        if row:
            #story already exists for this user! can't add it
            context['storyAlreadyExists'] = "A story with this name already exists for current user or the story name is blank. Please try again."
            return flask.render_template("addStory.html", **context)
        else:
        	#get current max storyid for this user and increment it one for new story
        	maxStoryId = connection.execute("SELECT max(storyid) from stories where username = ?", (context['username'],)).fetchone()['max(storyid)']
        	if maxStoryId == None:
        		maxStoryId = 0
            #add story to database
        	connection.execute("INSERT INTO stories(storyid, username, storyname) VALUES (?, ?, ?)", (maxStoryId + 1, context['username'], context['name']))
            
            #get storyid from newly inserted story
        	storyid = maxStoryId + 1

            #create folder in upload folder to store docs for this story
        	tempPath = os.path.join(UPLOAD_FOLDER, context['username'])
       		tempPath = os.path.join(tempPath, 'stories')
        	os.chdir(tempPath)
        	os.mkdir(context['name'])


        #set up file system structure to store documents for this story
        i = 1
        tempPath = os.path.join(UPLOAD_FOLDER, context['username'])
        tempPath = os.path.join(tempPath, 'stories')
        tempPath = os.path.join(tempPath, context['name'])
        os.chdir(tempPath)
        os.mkdir('documents')
        os.mkdir('images')

        #save uploaded documents for this new story into the file system at the appropriate place
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

            #add row to documents table
            connection.execute(
                "INSERT INTO documents(documentid, storyid, username, filename, frontcover) VALUES (?, ?, ?, ?, ?)", (i, storyid, context['username'], filename, '{}.jpg'.format(str(i)))
            )

            i = i + 1



        #add questions to database
        questionIdCounter = 1
        docIdCounter = 1
        while docIdCounter <= numberDocuments:
            while questionIdCounter <= numberQuestions:
                connection.execute(
                    "INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) VALUES (?, ?, ?, ?, ?)", (questionIdCounter, docIdCounter, storyid, context['username'], questions[questionIdCounter - 1])
                )
                questionIdCounter += 1
            questionIdCounter = 1
            docIdCounter += 1

    #revert current working directory back to what it was initially before returning
    os.chdir(initialPath)
    return flask.render_template("addStory.html", **context)