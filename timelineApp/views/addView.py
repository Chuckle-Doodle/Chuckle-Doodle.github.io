import flask
import timelineApp
import os


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

    os.chdir(initialPath)
    return flask.render_template("addView.html", **context)