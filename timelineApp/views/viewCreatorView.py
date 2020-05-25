"""
timelineApp view creator view.

URLs include:
/<storyid>/views
"""
import flask
import os
import json
import timelineApp
from timelineApp.config import UPLOAD_FOLDER


@timelineApp.app.route('/<int:storyid>/views/', methods=['GET', 'POST'])
def show_views(storyid):
    """Display views for this story and allow user ability to modify them."""
    initialPath = os.getcwd()
    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context = {}
    context['username'] = flask.session['username']
    context['storyid'] = storyid   #this shouldnt be necessary once I figure out the relative path thing
    context['documents'] = []
    connection = timelineApp.model.get_db()

    #get story name
    cursor0 = connection.execute("SELECT storyname from stories where storyid = ? and username = ?", (storyid, flask.session['username']))
    context['storyname'] = cursor0.fetchone()['storyname']


    #load in view data from config.json
    filePath = os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'])
    os.chdir(filePath)
    with open('config.json') as json_file:
        context['views'] = json.load(json_file)


    os.chdir(initialPath)
    #return flask.jsonify(context)
    return flask.render_template("viewCreatorView.html", **context)