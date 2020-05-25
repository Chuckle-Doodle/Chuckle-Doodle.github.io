"""
timelineApp index (main) view.

URLs include:
/
"""
import flask
import os
import timelineApp
from timelineApp.config import UPLOAD_FOLDER


@timelineApp.app.route('/welcome/', methods=['GET', 'POST'])
def show_index():
    #initialPath = os.getcwd()
    context = {}
    connection = timelineApp.model.get_db()

    #clear flask session if no users in database
    rows = connection.execute("SELECT * from users").fetchall()
    if len(rows) == 0:
        flask.session.clear()
        return flask.redirect(flask.url_for('show_login'))

    if "username" in flask.session:
        context['user'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

    stories = []  #list of stories that will be returned to front page of web app (index.html)
    #each element in list is dict with keys storyid and storyname


    cursor = connection.execute("SELECT * from stories where username = ?", (flask.session['username'],))
    for row in cursor.fetchall():
        story = {}
        story['storyid'] = row['storyid']
        story['storyname'] = row['storyname']
        stories.append(story)


    context['stories'] = stories   #key = stories string. val = list of stories

    context['importableStories'] = []
    #gather list of stories that are available to be imported (aka all stories that have been exported by some user)
    #aka all stories in the exportedStories directory in the file system
    tempPath = os.path.join(UPLOAD_FOLDER, 'exportedStories')
    directory = os.fsencode(tempPath)

    storyAlreadyImported = False

    for file in os.listdir(directory):
        story = os.fsdecode(file).rsplit(".", 1)[0]
        #ensure this story hasn't already been imported by this user before importing it
        for s in context['stories']:
            if s['storyname'] == story:
                storyAlreadyImported = True
        if storyAlreadyImported == False:
            context['importableStories'].append(story)

    #option to delete account if this isn't the default user
    if flask.session['username'] != "test":
        context['ableToDeleteUser'] = True
    else:
        context['ableToDeleteUser'] = False

    #os.chdir(initialPath)
    #return "Return value of show_index function in index.py in views.  This is main page of app"

    return flask.render_template("index.html", **context)
