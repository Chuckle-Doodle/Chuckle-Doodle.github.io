INSERT INTO users(username, password)
VALUES
('test', 'test');


INSERT INTO stories(storyid, username, storyname)
VALUES
(1, 'test', 'Black_Death');


INSERT INTO documents(documentid, storyid, username, filename, frontcover)
VALUES
(1, 1, 'test', 'black death-wages-economy.pdf', '1.jpg'),
(2, 1, 'test', 'black_death_2.pdf', '2.jpg'),
(3, 1, 'test', 'black_death_3.pdf', '3.jpg'),
(4, 1, 'test', 'black_death_4.pdf', '4.jpg');


INSERT INTO formquestions(questionid, documentid, storyid, username, questiontext)
VALUES
(1, 1, 1, 'test', 'Title'),
(2, 1, 1, 'test', 'Author'),
(3, 1, 1, 'test', 'When was this written'),
(4, 1, 1, 'test', 'When did the event occur'),
(5, 1, 1, 'test', 'Where did the event occur'),
(1, 2, 1, 'test', 'Title'),
(2, 2, 1, 'test', 'Author'),
(3, 2, 1, 'test', 'When was this written'),
(4, 2, 1, 'test', 'When did the event occur'),
(5, 2, 1, 'test', 'Where did the event occur'),
(1, 3, 1, 'test', 'Title'),
(2, 3, 1, 'test', 'Author'),
(3, 3, 1, 'test', 'When was this written'),
(4, 3, 1, 'test', 'When did the event occur'),
(5, 3, 1, 'test', 'Where did the event occur'),
(1, 4, 1, 'test', 'Title'),
(2, 4, 1, 'test', 'Author'),
(3, 4, 1, 'test', 'When was this written'),
(4, 4, 1, 'test', 'When did the event occur'),
(5, 4, 1, 'test', 'Where did the event occur');