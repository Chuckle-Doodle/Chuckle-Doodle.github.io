import flask
import timelineApp
from timelineApp.config import UPLOAD_FOLDER
from pdf2image import convert_from_path
import os
from werkzeug.utils import secure_filename


@timelineApp.app.route('/addStory/', methods=['GET', 'POST'])
def add_story_2():

    context = {}
    connection = timelineApp.model.get_db()

    if "username" in flask.session:
        context['user'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

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
        print(flask.request.form)
        for key, val in flask.request.form.items():
            if key == 'title':
                context['name'] = val
            else:
                if len(val) > 0:
                    questions.append(val)

        numberQuestions = len(questions)

        #check if story already exists. if so, error. else, add it to stories table
        row = connection.execute("SELECT storyname from stories where storyname = ?", (context['name'],)).fetchone()
        print("row is")
        print(row)
        if row:
            #story already exists! can't add it
            context['storyAlreadyExists'] = "A story with this name already exists or the story name is blank. Please try again."
            return flask.render_template("addStory.html", **context)
        else:
            #add story to database
            connection.execute("INSERT INTO stories(storyname) VALUES (?)", (context['name'],))
            
            #get storyid from newly inserted story
            storyid = connection.execute("SELECT storyid from stories where storyname = ?", (context['name'],)).fetchone()['storyid']

            #create folder in upload folder to store docs for this story
            os.chdir(UPLOAD_FOLDER)
            os.mkdir(context['name'])


        i = 1
        os.chdir(os.path.join(UPLOAD_FOLDER, context['name']))

        docids = []

        while i <= numberDocuments:
            f = flask.request.files['document' + str(i)]
            filename = secure_filename(f.filename)
            updatedPath = os.path.join(UPLOAD_FOLDER, context['name'])
            f.save(os.path.join(updatedPath, filename))

            #extract frontcover from pdf
            pages = convert_from_path(filename, 500)
            for page in pages:
                page.save('frontPageDoc{}.jpg'.format(str(i)), 'JPEG')
                break

            #add row to documents table
            connection.execute(
                "INSERT INTO documents(filename, frontcover, storyid) VALUES (?, ?, ?)", (filename, 'frontPageDoc{}.jpg'.format(str(i)), storyid)
            )
            docid = connection.execute(
                "SELECT documentid from documents where storyid = ? and filename = ?", (storyid, filename)
            ).fetchone()['documentid']
            docids.append(docid)

            i = i + 1



        #TODO add questions to database
        for docid in docids:
            for question in questions:
                connection.execute(
                    "INSERT INTO formquestions(storyid, documentid, questiontext) VALUES (?, ?, ?)", (storyid, docid, question)
                )



    #return "Return value of show_index function in index.py in views.  This is main page of app"
    return flask.render_template("addStory.html", **context)