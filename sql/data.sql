INSERT INTO stories(storyid, storyname)
VALUES
(1, 'Columbus Day'),
(2, 'American Revolution'),
(3, 'Black_Death');


INSERT INTO documents(documentid, filename, frontcover, storyid)
VALUES
(1, 'black death-wages-economy.pdf', 'doc1cover.jpg', 3),
(2, 'black_death_2.pdf', 'doc2cover.jpg', 3),
(3, 'black_death_3.pdf', 'doc3cover.jpg', 3),
(4, 'black_death_4.pdf', 'doc4cover.jpg', 3);


INSERT INTO formquestions(storyid, documentid, questiontext)
VALUES
(3, 1, 'Title'),
(3, 1, 'Author'),
(3, 1, 'When was this written'),
(3, 1, 'When did the event occur'),
(3, 1, 'Where did the event occur'),
(3, 2, 'Title'),
(3, 2, 'Author'),
(3, 2, 'When was this written'),
(3, 2, 'When did the event occur'),
(3, 2, 'Where did the event occur'),
(3, 3, 'Title'),
(3, 3, 'Author'),
(3, 3, 'When was this written'),
(3, 3, 'When did the event occur'),
(3, 3, 'Where did the event occur'),
(3, 4, 'Title'),
(3, 4, 'Author'),
(3, 4, 'When was this written'),
(3, 4, 'When did the event occur'),
(3, 4, 'Where did the event occur');