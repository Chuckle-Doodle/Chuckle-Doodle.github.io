"""REST API for all API end points."""
import flask
import timelineApp


@timelineApp.app.route('/api/', methods=["GET"])
def get_root():
    """Return list of all API end points for this application."""
    context = {
        "get all stories and their associated questions, sorted by storyid": "/api/stories/",
        "add or delete story from list": "/api/stories/",
        "get individual story and its questions": "/api/stories/<storyid>/",
        "add or delete question from individual story's question list": "/api/stories/<storyid>/"
        #TODO add api endpoint to edit question list per doc in a story, instead of just per story
    }
    return flask.jsonify(**context)
