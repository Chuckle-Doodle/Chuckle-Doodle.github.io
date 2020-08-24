import flask
import timelineApp
import math
from timelineApp.config import UPLOAD_FOLDER
from pdf2image import convert_from_path
import os
from werkzeug.utils import secure_filename


@timelineApp.app.route('/editStory/', methods=['GET', 'POST'])
def edit_story():
    
    
    #check if user is signed in. if not go back to login screen
    context = {}
    if "username" in flask.session:
        context['username'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

    #store current working directory to return to this at end.
    initialPath = os.getcwd()

    #setup context dict to be populated and connect to database.
    context = {}
    connection = timelineApp.model.get_db()



    #get which story is to be edited.
    originalStoryName = flask.request.form['storyToEdit']
    context['originalStoryName'] = originalStoryName

    #get storyid in database for this particular story, for use in below queries
    storyId = connection.execute("SELECT storyid FROM stories where username = ? and storyname = ?", (flask.session['username'], context['originalStoryName'])).fetchone()['storyid']
    
    #ensure storyId is a number, otherwise there's a problem
    if storyId == None:
        return "ERROR: the story that is going to be edited is not found in database!"

    docs = connection.execute("SELECT documentid, filename FROM documents where username = ? and storyid = ?", (flask.session['username'], storyId)).fetchall()
    numDocs = 0
    for doc in docs:

        
        numDocs = numDocs + 1
    
    questions = connection.execute("SELECT questiontext FROM formquestions where username = ? and storyid = ?", (flask.session['username'], storyId)).fetchall()
    totalQuestions = 0
    for q in questions:
        
        
        totalQuestions = totalQuestions + 1
        
    uniqueQuestions = math.ceil(totalQuestions / numDocs)

    if (flask.request.method == 'POST'):

        print(flask.request.form.items)

        context['username'] = flask.session['username']
        #extract file objects for use later
        files = []
        for docid, file in flask.request.files.items():
            fname = secure_filename(file.filename)
            if len(fname) > 0:
                files.append(fname)
        


        #extract question data from form for later
        #Could also use this to remove storyname from the first entry
        questions = []
        for key, val in flask.request.form.items():
            if key == 'title':
                context['storyName'] = val
            else:
                if len(val) > 0:
                    questions.append(val)

        numberQuestions = len(questions) 

        
        
        
        
        print(questions)

        #Check if this request is to delete a question
        if 'deleteQuestionForm' in flask.request.form:
            #print("Now deleting question: ")
            #print(int(flask.request.form['deleteQuestionForm'][-1]))
            questionToDelete = int(flask.request.form['deleteQuestionForm'][-1])

            #Need a loop to delete each instance of a question from each pdf
            #Loop value goes in documentid
            #Remeber to delete answers also
            docidIndex = 1
            while docidIndex <= numDocs:
                connection.execute("DELETE FROM formquestions WHERE questionid = ? and documentid = ? and storyid = ? and username = ?", (questionToDelete,docidIndex,storyId,context['username']))
               # print("deleting question")
                docidIndex = docidIndex + 1
            #Subtract one from number of unique questions
            uniqueQuestions = uniqueQuestions - 1
            #print("unique = ")
            #print(uniqueQuestions)
            #After deleting, update ids of questions after. First check if question deleted was the last one. Remember to update answer ids also

            #If the question id was not the last one then change the ids
            if questionToDelete != uniqueQuestions + 1:
                questionsToChange = uniqueQuestions + 1 - questionToDelete #Number of question ids to update
                n = 1
                while n <= questionsToChange: #Need second loop for documents (need to go through all docs)
                    documentindex = 1
                    while documentindex <= numDocs: #numquestions
                        connection.execute("UPDATE formquestions SET questionid = ? where questionid =? and documentid = ? and storyid = ? and username = ?",(questionToDelete,questionToDelete+1,documentindex,storyId,context['username']))
                        #print("updating ids")
                        
                        documentindex = documentindex + 1
                    questionToDelete = questionToDelete + 1
                    n = n + 1


        else: #Update questions and add a new one if there is one
            k = 1
            while k <= numDocs:
                j = 1
                while j < numberQuestions:
                    
                    
                    connection.execute("UPDATE formquestions SET questiontext = ? where questionid = ? and documentid = ? and storyid = ? and username = ?", (questions[j], j, k, storyId, context['username']))
                    j = j + 1
                
                
                
                k = k + 1     

        if numberQuestions > uniqueQuestions + 1:
            documentID = 1
            while documentID <= numDocs:
                    #Inserts the new question in
                connection.execute(
                "INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) VALUES (?, ?, ?, ?, ?)", (uniqueQuestions + 1, documentID , storyId, context['username'], questions[numberQuestions-1])
                ) 
                documentID = documentID + 1
        #i = 1
        context['username'] = flask.session['username']
        tempPath = os.path.join(UPLOAD_FOLDER, "users")
        tempPath = os.path.join(tempPath, context['username'])
        tempPath = os.path.join(tempPath, 'stories')
        tempPath = os.path.join(tempPath, context['originalStoryName'])
        os.chdir(tempPath)
        #os.mkdir('documents')
        #os.mkdir('images')

        #save uploaded documents for this story into proper directory in file system
        #while i <= numberDocuments:
         #   f = flask.request.files['document' + str(i)]
          #  filename = secure_filename(f.filename)
           # updatedPath = os.path.join(tempPath, 'documents')
            #pathToFile = os.path.join(updatedPath, filename)
            #f.save(pathToFile)

            ##extract frontcover from pdf
            #pages = convert_from_path(pathToFile, 500)
            #for page in pages:
            #	os.chdir(os.path.join(tempPath, 'images'))
            #	page.save('{}.jpg'.format(str(i)), 'JPEG')
            #	break

            #os.chdir(tempPath)

            #update record in documents table
            #TODO Replace the "1" with storyid
            #connection.execute(
             #   "INSERT INTO documents(documentid, storyid, username, filename, frontcover) VALUES (?, ?, ?, ?, ?)", (i, 1, context['username'], filename, '{}.jpg'.format(str(i)))
            #)
            #connection.execute("UPDATE documents SET //// where ////")


            #i = i + 1



        #update questions in database with new questions for this story
        #questionIdCounter = 1
        #docIdCounter = 1
        #while docIdCounter <= numberDocuments:
         #   while questionIdCounter <= numberQuestions:
                #connection.execute(
                #    "INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext) VALUES (?, ?, ?, ?, ?)", (questionIdCounter, docIdCounter, storyid, context['username'], questions[questionIdCounter - 1])
                #)
          #      connection.execute("UPDATE formquestions SET ")

           #     questionIdCounter += 1
            #questionIdCounter = 1
            #docIdCounter += 1


    ############  do below code if get request (also if post request? ...)  #################




    #go to database to retrieve documents and questions currently stored for this story to populate editStory form with most recent data.
    context['storyDocuments'] = []
    context['storyQuestions'] = []

    docs = connection.execute("SELECT documentid, filename FROM documents where username = ? and storyid = ?", (flask.session['username'], storyId)).fetchall()
    numDocs = 0
    for doc in docs:

        context['storyDocuments'].append(doc['filename']) #populate this dict with the names of each document file for this story
        numDocs = numDocs + 1

    #Extract the unique questions from database
    questions = connection.execute("SELECT questiontext FROM formquestions where documentid = ? and username = ? and storyid = ?", (1,flask.session['username'], storyId)).fetchall()

    allQuestions = []
    totalQuestions = 0
    for q in questions:
        
        allQuestions.append(q['questiontext'])
        context['storyQuestions'].append(q['questiontext'])
        totalQuestions = totalQuestions + 1
        
    #uniqueQuestions = math.ceil(totalQuestions / numDocs)
    #count = 0
    #while count < uniqueQuestions:
     #   context['storyQuestions'].append(allQuestions[count])
      #  count = count + 1



    #upon finishing, revert current working directory back to what it was initially
    os.chdir(initialPath)

    return flask.render_template("editStory.html", **context)