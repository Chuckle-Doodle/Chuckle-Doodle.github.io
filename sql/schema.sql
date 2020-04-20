CREATE TABLE users(
    username    VARCHAR(20)   NOT NULL,
    password    VARCHAR(256)  NOT NULL,
    PRIMARY KEY(username)
);

CREATE TABLE stories(
    storyid    INTEGER       NOT NULL,
    storyname  VARCHAR(64)   NOT NULL,
    PRIMARY KEY(storyid)

);

CREATE TABLE documents(
    documentid   INTEGER      NOT NULL,
    filename     VARCHAR(64)  NOT NULL,
    frontcover   VARCHAR(64)  NOT NULL,
    storyid      INTEGER      NOT NULL,

    PRIMARY KEY(documentid),
    FOREIGN KEY(storyid) REFERENCES stories(storyid) ON DELETE CASCADE
);

CREATE TABLE formquestions(
    questionid    INTEGER PRIMARY KEY    ,
    storyid       INTEGER        NOT NULL,
    documentid    INTEGER        NOT NULL,
    questiontext  VARCHAR(1024)  NOT NULL,

    FOREIGN KEY(storyid) REFERENCES stories(storyid) ON DELETE CASCADE,
    FOREIGN KEY(documentid) REFERENCES documents(documentid) ON DELETE CASCADE
);

CREATE TABLE formanswers(
    username      VARCHAR(20)    NOT NULL,
    questionid    INTEGER        NOT NULL,
    answertext    VARCHAR(1024)          ,

    PRIMARY KEY (username, questionid),
    FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY(questionid) REFERENCES formquestions(questionid) ON DELETE CASCADE
);



#CREATE TABLE formdata(
#    username      VARCHAR(20)    NOT NULL,
#    storyid       INTEGER        NOT NULL,
#    documentid    INTEGER        NOT NULL,
#    questionid    INTEGER        NOT NULL,
#    questiontext  VARCHAR(1024)  NOT NULL,
#    answertext    VARCHAR(1024)          ,

#    PRIMARY KEY(storyid, documentid, questionid),
#    FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
#    FOREIGN KEY(storyid) REFERENCES stories(storyid) ON DELETE CASCADE,
#    FOREIGN KEY(documentid) REFERENCES documents(documentid) ON DELETE CASCADE
#);

# test run below  --> this below should encapsulate same functionality as above code,
# but with concerns separated and therefore neater and more scalable

#FOR BELOW TABLE
#PRIMARY KEY(storyid, documentid, questionid), #DO I WANT THIS PRIMARY KEY TO BE ITS OWN UNIQUE ID VARIABLE IN THIS TABLE ??     
