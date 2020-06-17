import flask
import timelineApp
from timelineApp.config import UPLOAD_FOLDER
import os
import json


@timelineApp.app.route('/addView/<int:storyid>/', methods=['GET', 'POST'])
def add_view(storyid):
    """Add view to this story for this user."""
    initialPath = os.getcwd()
    context = {}
    connection = timelineApp.model.get_db()

    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context['username'] = flask.session['username']
    context['storyname'] = connection.execute("SELECT storyname from stories WHERE username = ? and storyid = ?", (context['username'], storyid)).fetchone()['storyname']
    context['storyid'] = storyid

    if flask.request.method == 'POST':
        print(flask.request.form)

        #edit config.json file to add this view
        with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
            data = json.load(jsonFile)

            newView = {}
            newView['Active'] = flask.request.form['active']
            newView['ClusterBy'] = flask.request.form['clusterBy']
            newView['Name'] = flask.request.form['title']
            newView['ReferenceViews'] = []


            refView1 = {}
            refView1['Question'] = flask.request.form['RefView1Question']
            refView1['Type'] = flask.request.form['RefView1Type']
            newView['ReferenceViews'].append(refView1)

            refView2 = {}
            refView2['Question'] = flask.request.form['RefView2Question']
            refView2['Type'] = flask.request.form['RefView2Type']
            newView['ReferenceViews'].append(refView2)


            data['Views'].append(newView)

            jsonFile.seek(0)  # rewind
            json.dump(data, jsonFile)
            jsonFile.truncate()

    os.chdir(initialPath)
    return flask.render_template("addView.html", **context)