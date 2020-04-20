"""
timelineApp timeline view.

URLs include:
/<storyid>
"""
import flask
import timelineApp


@timelineApp.app.route('/<int:storyid>/timeline/', methods=['GET', 'POST'])
def show_timeline(storyid):
    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context = {}
    context['storyid'] = storyid
    context['user'] = flask.session['username']

    #return "here is where we want to use d3, idk about rendering template w jinja for displaying timeline"
    return flask.render_template("timelineView.html", **context)