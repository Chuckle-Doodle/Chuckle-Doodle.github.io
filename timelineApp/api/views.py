#return json to user that displays each story with its associated questions.
#allow user to submit post requests to edit this data to their liking
import flask
import timelineApp


@timelineApp.app.route('/api/stories/<int:storyid>/views', methods=["GET"])
def get_current_views(storyid):

    # ***** Hardcode this view stuff in for now. ****** #
    #
    ##
    ###
    ####
    context = {}
    context['Views'] = []

    temp = {}

    temp["Name"] = "Author View"
    temp["ReferenceViews"] = []
    view = {}
    view["Type"] = "Timeline"
    view["Question"] = "When did the event occur"
    temp["ReferenceViews"].append(view)

    view2 = {}
    view2["Type"] = "Map"
    view2["Question"] = "When was this written"
    temp["ReferenceViews"].append(view2)

    temp["ClusterBy"] = "Author"
    temp["Active"] = True

    context['Views'].append(temp)


    temp = {}

    temp["Name"] = "Location of Event View"
    temp["ReferenceViews"] = []
    view = {}
    view["Type"] = "Timeline"
    view["Question"] = "When did the event occur"
    temp["ReferenceViews"].append(view)

    view2 = {}
    view2["Type"] = "Map"
    view2["Question"] = "Where did the event occur"
    temp["ReferenceViews"].append(view2)

    temp["ClusterBy"] = "Where did the event occur"
    temp["Active"] = False

    context['Views'].append(temp)

    # ************************************************** #

    return flask.jsonify(**context)
