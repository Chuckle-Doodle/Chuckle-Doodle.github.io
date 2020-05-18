import flask
import timelineApp
import os
import shutil


@timelineApp.app.route('/deleteAccount/', methods=['GET'])
def delete_account():
    """Delete this account."""
    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    username = flask.session['username']

    connection = timelineApp.model.get_db()
    connection.execute("DELETE FROM users WHERE username = ?", (username,))

    #also delete user account data in file system
    #initialPath = os.getcwd()
    newPath = "timelineApp/static/var/users/" + username
    shutil.rmtree(newPath)

    return flask.redirect(flask.url_for('show_login'))