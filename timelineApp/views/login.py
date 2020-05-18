import flask
import timelineApp
from flask import request
import os
import shutil
import errno
from distutils.dir_util import copy_tree


@timelineApp.app.route('/', methods=['GET', 'POST'])
def show_login():
    """Display / route."""
    dbase = timelineApp.model.get_db()
    cursor = dbase.cursor()

    # Check if a user is currently logged in
    if "username" in flask.session:


        #also check if username is in database
        userExists = cursor.execute("SELECT username from users where username = ?", (flask.session['username'],)).fetchone()
        if userExists:
            return flask.redirect(flask.url_for('show_index'))
        else:
            flask.session.clear()

    context = {}

    if flask.request.method == 'POST':

        #check if logging in or signing up
        if request.form['action'] == "Login":
            given_user = flask.request.form['username']
            given_password = flask.request.form['password']

            password_check = "SELECT password FROM users WHERE username = '{0}';"
            rows = cursor.execute(password_check.format(given_user)).fetchone()
            if rows:
                if rows['password'] == given_password:

                    flask.session['username'] = given_user
                    return flask.redirect(flask.url_for('show_index'))

            # Unsuccessful Login
            context["unsuccessful_str"] = "Username or password is incorrect. Try again."
            return flask.render_template("login.html", **context)

        else:
            #request.form['action'] == Sign Up  should be the case if we get here
            new_user = flask.request.form['username']
            new_password = flask.request.form['password']

            #ensure length between 1 and 20 characters
            if len(new_user) < 1 or len(new_user) > 20 or len(new_password) < 1 or len(new_password) > 20:
                # Unsuccessful sign up
                context["unsuccessful_str"] = "Username and password must be between 1 and 20 characters each. Try again."
                return flask.render_template("login.html", **context)


            #ensure username is unique
            rows = cursor.execute("SELECT username from users where username = ?", (new_user,)).fetchall()
            if rows:
                #not a unique username. print out error message to webpage
                context["not_unique_username"] = "Username must be unique and no more than 20 characters. Try again."
                return flask.render_template("login.html", **context)
            else: #username IS unique
                addUser = cursor.execute(
                    "INSERT INTO users(username, password) "
                    "VALUES (?, ?) ", (new_user, new_password)
                )

                flask.session['username'] = new_user


                #create folder in file system for user
                initialPath = os.getcwd()
                #tempPath = "sql/users/test/stories/"
                #sourcePath = os.path.join(initialPath, tempPath)
                #print("source path is!")
                #print(sourcePath)
                #print("wd is :::::")
                #print(os.getcwd())
                newPath = "timelineApp/static/var/users/"
                os.chdir(newPath)
                os.mkdir(flask.session['username'])
                os.chdir(flask.session['username'])
                os.mkdir("stories")

                os.chdir(initialPath)
                #destinationPath = os.getcwd()
                #destinationPath = os.path.join(destinationPath, "Black_Death")
                #print(destinationPath)
                    
                #copy_tree(sourcePath, destinationPath)

                return flask.redirect(flask.url_for('show_index'))




    # Initial request to login page
    return flask.render_template("login.html", **context)