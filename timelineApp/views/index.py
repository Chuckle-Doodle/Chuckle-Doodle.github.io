"""
timelineApp index (main) view.

URLs include:
/
"""
import flask
import timelineApp


@timelineApp.app.route('/welcome/', methods=['GET', 'POST'])
def show_index():
    """Display / route."""
    context = {}
    connection = timelineApp.model.get_db()

    if "username" in flask.session:
        context['user'] = flask.session['username']
    else:
        return flask.redirect(flask.url_for('show_login'))

    stories = []  #list of stories that will be returned to front page of web app (index.html)
    #each element in list is dict with keys storyid and storyname

    cursor = connection.execute("SELECT * from stories")
    for row in cursor.fetchall():
        story = {}
        story['storyid'] = row['storyid']
        story['storyname'] = row['storyname']
        stories.append(story)

    context['stories'] = stories   #key = stories string. val = list of stories

    #return "Return value of show_index function in index.py in views.  This is main page of app"
    return flask.render_template("index.html", **context)
