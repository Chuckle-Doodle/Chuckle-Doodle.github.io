CREATE TABLE stories(
    storyid    INTEGER       NOT NULL,
    storyname  VARCHAR(64)   NOT NULL,
    PRIMARY KEY(storyid)

);

CREATE TABLE documents(
    documentid   INTEGER      NOT NULL,
    filename     VARCHAR(64)  NOT NULL,
    storyid      INTEGER      NOT NULL,

    PRIMARY KEY(documentid),
    FOREIGN KEY(storyid) REFERENCES stories(storyid) ON DELETE CASCADE
);

CREATE TABLE formdata(
    storyid       INTEGER        NOT NULL,
    documentid    INTEGER        NOT NULL,
    questiontext  VARCHAR(1024)  NOT NULL,
    answertext    VARCHAR(1024)          ,

    PRIMARY KEY(storyid, documentid, questiontext),
    FOREIGN KEY(storyid) REFERENCES stories(storyid) ON DELETE CASCADE,
    FOREIGN KEY(documentid) REFERENCES documents(documentid) ON DELETE CASCADE
);