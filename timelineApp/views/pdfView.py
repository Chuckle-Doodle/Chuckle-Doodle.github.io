"""
timelineApp pdf view.

URLs include:
/<storyid>
"""
import flask
import timelineApp


@timelineApp.app.route('/<int:storyid>/', methods=['GET', 'POST'])
def show_pdf(storyid):
    """Display pdf view (pdf of documents + questions for this story)."""
    #things to return to pdfView.html template: pdfs for each document in story, questions pertaining to each doc

    connection = timelineApp.model.get_db()
    context = {}

    #clear flask session if no users in database
    rows = connection.execute("SELECT * from users").fetchall()
    if len(rows) == 0:
        flask.session.clear()
        return flask.redirect(flask.url_for('show_login'))

    if "username" in flask.session:
        context['username'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))


    if (flask.request.method == 'POST'):
        # find out which form aka document this submission corresponds with
        docid = int(flask.request.form['submit'][-1:])

        # get number of questions associated with this document / this post request
        #cursor3 = connection.execute("SELECT COUNT(*) FROM formquestions where storyid = ? and documentid = ?", (storyid, docid))
        cursor3 = connection.execute("SELECT questionid FROM formquestions where username = ? and storyid = ? and documentid = ?", (context['username'], storyid, docid))
        questionIDs = cursor3.fetchall()
        numberOfQuestions = len(questionIDs)
        for i in range(1, numberOfQuestions + 1):  # +1 to do 1 indexing rather than 0 indexing
            #persist this answer to the database
            #connection.execute("UPDATE formdata SET answertext = ? WHERE storyid = ? and documentid = ? and questionid = ?", (flask.request.form[str(i)], storyid, docid, i))
            #check if answer already exists. if so update it don't insert
            cursor0 = connection.execute("SELECT * from formanswers where username = ? and storyid = ? and documentid = ? and questionid = ?", (flask.session['username'], storyid, docid, questionIDs[i - 1]['questionid']))
            if cursor0.fetchone():
                #UPDATE NOT INSERT INTO IF already there !
                connection.execute("UPDATE formanswers SET answertext = ? where username = ? and storyid = ? and documentid = ? and questionid = ?", (flask.request.form[str(i)], flask.session['username'], storyid, docid, questionIDs[i - 1]['questionid']))
            else:
                #no previous answer. so insert into table
                connection.execute(
                    "INSERT INTO formanswers(questionid, documentid, storyid, username, answertext) VALUES "
                    "(?, ?, ?, ?, ?)", (questionIDs[i - 1]['questionid'], docid, storyid, flask.session['username'], flask.request.form[str(i)])
                )

    context['storyid'] = storyid   #this shouldnt be necessary once I figure out the relative path thing
    context['documents'] = []
    #connection = timelineApp.model.get_db()

    #get story name
    cursor0 = connection.execute("SELECT storyname from stories where storyid = ? and username = ?", (storyid, flask.session['username']))
    context['storyname'] = cursor0.fetchone()['storyname']

    #get pdf files for this story
    docID = ""
    filenames = []
    cursor = connection.execute("SELECT documentid, filename from documents where storyid = ? and username = ?", (storyid, flask.session['username']))
    for row in cursor.fetchall():
        document = {}
        document['questions'] = []
        document['documentid'] = row['documentid']
        docID = row['documentid']
        document['filename'] = row['filename']


        cursor2 = connection.execute("SELECT questionid, questiontext from formquestions where documentid = ? and storyid = ? and username = ?", (docID, storyid, flask.session['username']))
        questions = cursor2.fetchall()

        for question in questions:
            answerData = connection.execute(
                "SELECT answertext from formanswers where questionid = ? and username = ? and storyid = ? and documentid = ?",
                (question['questionid'], flask.session['username'], storyid, docID)
            ).fetchone()

            if answerData:
                answer = answerData['answertext']
                document['questions'].append([question['questiontext'], answer])
            else:
                document['questions'].append([question['questiontext'], ""])

        context['documents'].append(document)

    #return flask.jsonify(**context), 201
    return flask.render_template("pdfView.html", **context)
