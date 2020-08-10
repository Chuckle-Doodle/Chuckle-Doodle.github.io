INSERT INTO users(username, password)
VALUES
('test', 'test');


INSERT INTO stories(storyid, username, storyname)
VALUES
(1, 'test', 'Black_Death'),
(2, 'test', 'Civil_War'),
(3, 'test', 'Civil_War_Virginia');


INSERT INTO documents(documentid, storyid, username, filename, frontcover)
VALUES
(1, 1, 'test', 'black death-wages-economy.pdf', '1.jpg'),
(2, 1, 'test', 'black_death_2.pdf', '2.jpg'),
(3, 1, 'test', 'black_death_3.pdf', '3.jpg'),
(4, 1, 'test', 'black_death_4.pdf', '4.jpg'),

(1, 2, 'test', 'Civil_War_doc1.pdf', '1.jpg'),
(2, 2, 'test', 'Civil_War_doc2.pdf', '2.jpg'),
(3, 2, 'test', 'Civil_War_doc3.pdf', '3.jpg'),
(4, 2, 'test', 'Civil_War_doc4.pdf', '4.jpg'),

(1, 3, 'test', 'CincinnatiPostAnti-Abolitionist.pdf', '1.jpg'),
(2, 3, 'test', 'NancyEmersonDiary.pdf', '2.jpg'),
(3, 3, 'test', 'Semi-centennialHistoryofWestVirginia.pdf', '3.jpg'),
(4, 3, 'test', 'SlaveryInWestVirginia1860.pdf', '4.jpg');


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
(5, 4, 1, 'test', 'Where did the event occur'),

(1, 1, 2, 'test', 'Title'),
(2, 1, 2, 'test', 'Author'),
(3, 1, 2, 'test', 'When was this written'),
(4, 1, 2, 'test', 'When did the event occur'),
(5, 1, 2, 'test', 'Where did the event occur'),
(1, 2, 2, 'test', 'Title'),
(2, 2, 2, 'test', 'Author'),
(3, 2, 2, 'test', 'When was this written'),
(4, 2, 2, 'test', 'When did the event occur'),
(5, 2, 2, 'test', 'Where did the event occur'),
(1, 3, 2, 'test', 'Title'),
(2, 3, 2, 'test', 'Author'),
(3, 3, 2, 'test', 'When was this written'),
(4, 3, 2, 'test', 'When did the event occur'),
(5, 3, 2, 'test', 'Where did the event occur'),
(1, 4, 2, 'test', 'Title'),
(2, 4, 2, 'test', 'Author'),
(3, 4, 2, 'test', 'When was this written'),
(4, 4, 2, 'test', 'When did the event occur'),
(5, 4, 2, 'test', 'Where did the event occur'),


(1, 1, 3, 'test', 'Title'),
(2, 1, 3, 'test', 'Author'),
(3, 1, 3, 'test', 'When was this written'),
(4, 1, 3, 'test', 'When did the event occur'),
(5, 1, 3, 'test', 'Where did the event occur'),
(6, 1, 3, 'test', 'What is the stance taken on slavery by the author?'),
(7, 1, 3, 'test', 'Is the state/location mentioned Union or Confederate?'),
(1, 2, 3, 'test', 'Title'),
(2, 2, 3, 'test', 'Author'),
(3, 2, 3, 'test', 'When was this written'),
(4, 2, 3, 'test', 'When did the event occur'),
(5, 2, 3, 'test', 'Where did the event occur'),
(6, 2, 3, 'test', 'What is the stance taken on slavery by the author?'),
(7, 2, 3, 'test', 'Is the state/location mentioned Union or Confederate?'),
(1, 3, 3, 'test', 'Title'),
(2, 3, 3, 'test', 'Author'),
(3, 3, 3, 'test', 'When was this written'),
(4, 3, 3, 'test', 'When did the event occur'),
(5, 3, 3, 'test', 'Where did the event occur'),
(6, 3, 3, 'test', 'What is the stance taken on slavery by the author?'),
(7, 3, 3, 'test', 'Is the state/location mentioned Union or Confederate?'),
(1, 4, 3, 'test', 'Title'),
(2, 4, 3, 'test', 'Author'),
(3, 4, 3, 'test', 'When was this written'),
(4, 4, 3, 'test', 'When did the event occur'),
(5, 4, 3, 'test', 'Where did the event occur'),
(6, 4, 3, 'test', 'What is the stance taken on slavery by the author?'),
(7, 4, 3, 'test', 'Is the state/location mentioned Union or Confederate?');