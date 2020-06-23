import flask
import os
import json
import timelineApp
from timelineApp.config import UPLOAD_FOLDER


@timelineApp.app.route('/editView/', methods=['GET', 'POST'])
def edit_view():
    """Add view to this story for this user."""
    initialPath = os.getcwd()

    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    connection = timelineApp.model.get_db()

    context = {}
    context['viewNumber'] = int(flask.request.args.get('viewToEdit'))
    context['storyid'] = flask.request.args.get('storyid')

    context['username'] = flask.session['username']
    context['storyname'] = connection.execute("SELECT storyname from stories WHERE username = ? and storyid = ?", (context['username'], context['storyid'])).fetchone()['storyname']

    if flask.request.method == 'POST':
        #edit config.json file with modified view data
        with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
            data = json.load(jsonFile)

            #edit data
            #data["Views"][context['viewNumber']]
            print(data["Views"][context['viewNumber'] - 1])
            data["Views"][context['viewNumber'] - 1]['Name'] = flask.request.form['title']
            data["Views"][context['viewNumber'] - 1]['ClusterBy'] = flask.request.form['clusterBy']
            data["Views"][context['viewNumber'] - 1]['Active'] = eval(flask.request.form['active'])
            data["Views"][context['viewNumber'] - 1]['ReferenceViews'][0]['Question'] = flask.request.form['RefView1Question']
            data["Views"][context['viewNumber'] - 1]['ReferenceViews'][0]['Type'] = flask.request.form['RefView1Type']
            data["Views"][context['viewNumber'] - 1]['ReferenceViews'][1]['Question'] = flask.request.form['RefView2Question']
            data["Views"][context['viewNumber'] - 1]['ReferenceViews'][1]['Type'] = flask.request.form['RefView2Type']


            jsonFile.seek(0)  # rewind
            json.dump(data, jsonFile)
            jsonFile.truncate()

    #get data for this view from config.json file
    with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r") as json_file:
        data = json.load(json_file)
        context['view'] = data['Views'][context['viewNumber'] - 1]

    os.chdir(initialPath)
    return flask.render_template("editView.html", **context)