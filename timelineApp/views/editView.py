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

    #get questions that correspond to this story
    context['questions'] = []
    rows = connection.execute("SELECT questiontext from formquestions WHERE username = ? and storyid = ? and documentid = 1", (context['username'], int(context['storyid']))).fetchall()
    for row in rows:
        context['questions'].append(row['questiontext'])

    if flask.request.method == 'POST':

        print("printing form editView.pyyyyyy")
        print(flask.request.form)
        #print(flask.request.form['ClusterByOptions'])
        #edit config.json file with modified view data
        with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
            data = json.load(jsonFile)

            #edit data

            #cluster options
            data["Views"][context['viewNumber'] - 1]['ClusterByOptions'].clear()
            counter = 1
            while ("ClusterByOption" + str(counter)) in flask.request.form:
                data["Views"][context['viewNumber'] - 1]['ClusterByOptions'].append(flask.request.form[("ClusterByOption" + str(counter))])
                counter += 1

            data["Views"][context['viewNumber'] - 1]['Name'] = flask.request.form['title']
            #data["Views"][context['viewNumber'] - 1]['ClusterByOptions'] = flask.request.form['ClusterByOptions']
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

    #print("printing context")
    #print(context)

    os.chdir(initialPath)
    return flask.render_template("editView.html", **context)