INSERT INTO stories(storyid, storyname)
VALUES
(1, 'Columbus Day'),
(2, 'American Revolution'),
(3, 'Black Death');

INSERT INTO documents(documentid, filename, storyid)
VALUES
(1, 'black death-wages-economy.pdf', 3),
(2, 'black_death_2.pdf', 3),
(3, 'black_death_3.pdf', 3),
(4, 'black_death_4.pdf', 3);

INSERT INTO formdata(storyid, documentid, questiontext, answertext)
VALUES
(3, 1, 'Title?', ""),
(3, 1, 'Author?', ""),
(3, 1, 'When was this written?', ""),
(3, 1, 'Where did the event occur?', ""),
(3, 2, 'Title?', ""),
(3, 2, 'Author?', ""),
(3, 2, 'When was this written?', ""),
(3, 2, 'Where did the event occur?', ""),
(3, 3, 'Title?', ""),
(3, 3, 'Author?', ""),
(3, 3, 'When was this written?', ""),
(3, 3, 'Where did the event occur?', ""),
(3, 4, 'Title?', ""),
(3, 4, 'Author?', ""),
(3, 4, 'When was this written?', ""),
(3, 4, 'Where did the event occur?', "");
