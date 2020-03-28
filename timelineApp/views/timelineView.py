"""
timelineApp timeline view.

URLs include:
/<storyid>
"""
import flask
import timelineApp


@timelineApp.app.route('/<int:storyid>/timeline/', methods=['GET', 'POST'])
def show_timeline(storyid):
    #SAMPLE CODE BELOW

    """
    context = {}
    context['documents'] = []
    connection = timelineApp.model.get_db()

    #get story name
    cursor0 = connection.execute("SELECT storyname from stories where storyid = ?", (storyid,))
    context['storyname'] = cursor0.fetchone()['storyname']

    #get pdf files for this story
    docID = ""
    filenames = []
    cursor = connection.execute("SELECT documentid, filename from documents where storyid = ?", (storyid,))
    for row in cursor.fetchall():
        document = {}
        document['questions'] = {}
        document['documentid'] = row['documentid']
        docID = row['documentid']
        document['filename'] = row['filename']

        #is this query within the for loop allowed??
        print("printing docID before inside query: ", docID)
        cursor2 = connection.execute(
            "SELECT questiontext, answertext from formdata where documentid = ?", (docID,)
        )
        for row2 in cursor2.fetchall():
            print(row2)
            document['questions'][row2['questiontext']] = row2['answertext']

        context['documents'].append(document)

    """

    #return "here is where we want to use d3, idk about rendering template w jinja for displaying timeline"
    return flask.render_template("timelineView.html")