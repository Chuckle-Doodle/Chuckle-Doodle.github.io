CREATE TABLE users(
    username    VARCHAR(20)   NOT NULL,
    password    VARCHAR(256)  NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE stories(
    storyid    INTEGER       NOT NULL,
    username   VARCHAR(20)   NOT NULL,

    storyname  VARCHAR(64)   NOT NULL,
    PRIMARY KEY (storyid, username),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE documents(
    documentid   INTEGER      NOT NULL,
    storyid      INTEGER      NOT NULL,
    username     VARCHAR(20)  NOT NULL,

    filename     VARCHAR(64)  NOT NULL,
    frontcover   VARCHAR(64)  NOT NULL,
    PRIMARY KEY (documentid, storyid, username),
    FOREIGN KEY (storyid, username) REFERENCES stories(storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE formquestions(
    questionid    INTEGER        NOT NULL,
    documentid    INTEGER        NOT NULL,
    storyid       INTEGER        NOT NULL,
    username      VARCHAR(20)    NOT NULL,

    questiontext  VARCHAR(1024)  NOT NULL,
    PRIMARY KEY (questionid, documentid, storyid, username),
    FOREIGN KEY (documentid, storyid, username) REFERENCES documents(documentid, storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (storyid, username) REFERENCES stories(storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE formanswers(
    questionid    INTEGER        NOT NULL,
    documentid    INTEGER        NOT NULL,
    storyid       INTEGER        NOT NULL,
    username      VARCHAR(20)    NOT NULL,

    answertext    VARCHAR(1024)          ,

    PRIMARY KEY (questionid, documentid, storyid, username),
    FOREIGN KEY (questionid, documentid, storyid, username) REFERENCES formquestions(questionid, documentid, storyid, username) ON UPDATE CASCADE,
    FOREIGN KEY (questionid, documentid, storyid, username) REFERENCES formquestions(questionid, documentid, storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (documentid, storyid, username) REFERENCES documents(documentid, storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (storyid, username) REFERENCES stories(storyid, username) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);
