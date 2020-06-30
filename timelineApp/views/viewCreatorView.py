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

    #check if need to redirect based on Edit View button click:
    if (flask.request.args.get("editView") != None):
        viewToEdit = int(flask.request.args.get("editView")[-1])
        return flask.redirect(flask.url_for('edit_view', viewToEdit=viewToEdit, storyid=storyid, **flask.request.args))

    context = {}
    context['username'] = flask.session['username']
    context['storyid'] = storyid
    #context['documents'] = []
    context['DeletingActiveViewError'] = False

    #connect to database
    connection = timelineApp.model.get_db()

    #get story name
    cursor0 = connection.execute("SELECT storyname from stories where storyid = ? and username = ?", (storyid, flask.session['username']))
    context['storyname'] = cursor0.fetchone()['storyname']

    if flask.request.method == 'POST':

        if 'editView' in flask.request.form:
            viewToEdit = int(flask.request.form['editView'][-1])
            return flask.redirect(flask.url_for('edit_view', viewToEdit=viewToEdit, storyid=storyid, **flask.request.args))

        elif 'activateView' in flask.request.form:

            viewToActivate = int(flask.request.form['activateView'][-1])
            #need to change config.json file because later we will load in this file.
            with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
                data = json.load(jsonFile)

                #first set whichever view is currently Active to False (because two view's cannot both be active)
                for view in data["Views"]:
                    if view['Active'] == True:
                        view['Active'] = False

                #set desired view's active field to True
                data["Views"][viewToActivate - 1]['Active'] = True

                jsonFile.seek(0)  # rewind
                json.dump(data, jsonFile)
                jsonFile.truncate()

        elif 'deleteView' in flask.request.form:
            viewToDelete = int(flask.request.form['deleteView'][-1]) - 1  #subtract one due to indexing
            print("viewToDelete: ", viewToDelete)
            #change config.json file - delete this view. if it was active, need to activate diff view first!
            with open(os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'], 'config.json'), "r+") as jsonFile:
                data = json.load(jsonFile)

                #check if this view was active
                if data['Views'][viewToDelete]['Active'] == True:
                    context['DeletingActiveViewError'] = True
                    context['viewToDelete'] = viewToDelete
                    #return flask.render_template("viewCreatorView.html", **context)

                else:
                    #delete this view and update other view numbers
                    del data['Views'][viewToDelete]

                jsonFile.seek(0)  # rewind
                json.dump(data, jsonFile)
                jsonFile.truncate()

        else:
            return "Error: viewCreatorView.py form doesn't have correct fields."


    #load in view data from config.json
    filePath = os.path.join(UPLOAD_FOLDER, 'users', flask.session['username'], 'stories', context['storyname'])
    os.chdir(filePath)
    with open('config.json') as json_file:
        context['views'] = json.load(json_file)


    os.chdir(initialPath)
    #return flask.jsonify(context)
    #print(context['views']['Views'][0]['ClusterByOptions'])
    #print(type(context['views']['Views'][0]['ClusterByOptions']))
    return flask.render_template("viewCreatorView.html", **context)