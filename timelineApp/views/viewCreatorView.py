"""
timelineApp view creator view.

URLs include:
/<storyid>/views
"""
import flask
import timelineApp


@timelineApp.app.route('/<int:storyid>/views/', methods=['GET', 'POST'])
def show_views(storyid):
    """Display views for this story and allow user ability to modify them."""
        
    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    context = {}
    context['storyid'] = storyid   #this shouldnt be necessary once I figure out the relative path thing
    context['documents'] = []
    connection = timelineApp.model.get_db()

    #get story name
    cursor0 = connection.execute("SELECT storyname from stories where storyid = ? and username = ?", (storyid, flask.session['username']))
    context['storyname'] = cursor0.fetchone()['storyname']


    #return flask.jsonify(context)
    return flask.render_template("viewCreatorView.html", **context)