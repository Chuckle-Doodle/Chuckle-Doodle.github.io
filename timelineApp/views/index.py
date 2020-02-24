"""
timelineApp index (main) view.

URLs include:
/
"""
import flask
import timelineApp


@timelineApp.app.route('/', methods=['GET', 'POST'])
def show_index():
    """Display / route."""
    '''
    # If no user is logged in, redirect to show_login
    if "username" not in flask.session:
        return flask.redirect(flask.url_for('show_login'))

    curs = insta485.model.get_db().cursor()
    context = {}

    if flask.request.method == 'POST':
        if "comment" in flask.request.form:
            pid = flask.request.form['postid']
            curs.execute("SELECT MAX(commentid) AS MX FROM COMMENTS;")
            cid = str(curs.fetchone()['MX'] + 1)

            query = """ INSERT INTO COMMENTS(commentid, owner, postid, text)
            VALUES({0}, '{1}', {2}, '{3}');
            """.format(cid, flask.session['username'],
                       pid, flask.request.form['text'])
            curs.execute(query)
        elif "unlike" in flask.request.form:
            pid = flask.request.form['postid']
            query = "DELETE FROM LIKES WHERE owner = '{0}' AND postid = {1};"
            curs.execute(query.format(flask.session['username'], str(pid)))
        elif "like" in flask.request.form:
            pid = flask.request.form['postid']
            query = "INSERT INTO LIKES(owner, postid) VALUES('{0}', {1});"
            curs.execute(query.format(flask.session['username'], str(pid)))

    context["logname"] = flask.session['username']

    # Generate posts
    posts = []

    query = """SELECT * FROM POSTS WHERE owner IN (
    SELECT owner AS usr FROM USERS WHERE owner = '{0}'
    UNION
    SELECT username2 AS usr FROM FOLLOWING WHERE username1 = '{0}'
    )
    ORDER BY POSTS.created;
    """.format(context["logname"])
    curs.execute(query)

    for row in curs.fetchall():
        post = {}
        post["postid"] = row['postid']
        post["img_url"] = "/uploads/" + row['filename']
        post["owner"] = row['owner']

        # TIMESTAMP
        post["timestamp"] = arrow.get(row['created'],
                                      'YYYY-MM-DD HH:mm:ss').humanize()

        # likes
        like_q = "SELECT COUNT(*) AS COUNT FROM LIKES WHERE POSTID = {0};"
        curs.execute(like_q.format(str(post["postid"])))

        post["likes"] = curs.fetchone()['COUNT']

        lbl_query = """SELECT COUNT(*) AS COUNT FROM LIKES WHERE owner = '{0}'
        AND postid = {1};
        """.format(flask.session['username'], str(row['postid']))
        liked_by_logname = int(curs.execute(lbl_query).fetchone()['COUNT'])
        if liked_by_logname > 0:
            post["logname_likes_post"] = True
        else:
            post["logname_likes_post"] = False

        # Comments
        post["comments"] = []
        comm_q = """SELECT owner, text FROM COMMENTS WHERE postid = {0}
        ORDER BY COMMENTS.created;
        """
        curs.execute(comm_q.format(str(post["postid"])))
        for comm in curs.fetchall():
            comment = {}
            comment["owner"] = comm['owner']
            comment["text"] = comm['text']
            post["comments"].append(comment)

        # Prof pic
        pic_q = "SELECT FILENAME FROM USERS WHERE USERNAME = '{0}';"
        curs.execute(pic_q.format(post["owner"]))
        post["owner_img_url"] = "/uploads/" + curs.fetchone()['filename']
        posts.append(post)

    context["posts"] = posts
    return flask.render_template("index.html", **context)
    '''
    return "Return value of show_index function in index.py in views.  This is main page of app"
