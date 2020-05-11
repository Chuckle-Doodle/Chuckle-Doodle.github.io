CREATE TABLE users(
    username    VARCHAR(20)   NOT NULL,
    password    VARCHAR(256)  NOT NULL,
    PRIMARY KEY(username)
);

CREATE TABLE stories(
    storyid    INTEGER PRIMARY KEY,
    storyname  VARCHAR(64)   NOT NULL
);

CREATE TABLE documents(
    documentid   INTEGER PRIMARY KEY,
    filename     VARCHAR(64)  NOT NULL,
    frontcover   VARCHAR(64)  NOT NULL,
    storyid      INTEGER      NOT NULL,
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
