#return json to user that displays each story with its associated questions.
#allow user to submit post requests to edit this data to their liking
import flask
import timelineApp
from timelineApp.config import UPLOAD_FOLDER
import json
import os


@timelineApp.app.route('/api/stories/<int:storyid>/views', methods=["GET"])
def get_current_views(storyid):

    initialPath = os.getcwd()

    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context = {}

    connection = timelineApp.model.get_db()
    context['username'] = flask.session['username']
    context['storyid'] = storyid
    context['storyname'] = connection.execute("SELECT storyname from stories WHERE username = ? and storyid = ?", (context['username'], context['storyid'])).fetchone()['storyname']

    print("UPLOAD FOLDER IS: ", UPLOAD_FOLDER)
    with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
        data = json.load(jsonFile)

        #edit config.json file to append "docID" to beginning of clusterByOptions list for each view
        for view in data["Views"]:
            #don't append this if it's already there
            if view["ClusterByOptions"][0] == "Document ID":
                continue
            view["ClusterByOptions"][:0] = ['Document ID']

        jsonFile.seek(0)  # rewind
        json.dump(data, jsonFile)
        jsonFile.truncate()

    os.chdir(initialPath)
    return flask.jsonify(**data)
