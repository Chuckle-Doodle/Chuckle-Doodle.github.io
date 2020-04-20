import flask
import timelineApp


@timelineApp.app.route('/logout/', methods=['GET', 'POST'])
def show_logout():
    """Logout."""
    if "username" in flask.session:
        flask.session.pop('username')
    return flask.redirect(flask.url_for('show_login'))