CREATE DATABASE IF NOT EXISTS `mydb`;

-- users テーブル
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY NOT NULL,
    user_name VARCHAR(32) UNIQUE NOT NULL,
    display_name VARCHAR(64) NOT NULL,
    password VARCHAR(128) NOT NULL
);

-- posts テーブル
CREATE TABLE posts (
    id BINARY(16) PRIMARY KEY NOT NULL,
    title VARCHAR(128) NOT NULL,
    date DATETIME NOT NULL,
    category VARCHAR(32) NOT NULL,
    author BINARY(16) NOT NULL,
    FOREIGN KEY (author) REFERENCES users(id)
);

-- choices テーブル
CREATE TABLE choices (
    post_id BINARY(16) PRIMARY KEY NOT NULL,
    choice VARCHAR(64) NOT NULL,
    number INT NOT NULL DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- votes テーブル
CREATE TABLE votes (
    post_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    number INT NOT NULL,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

GRANT ALL PRIVILEGES ON `mydb`.* TO 'myuser'@'%';

FLUSH PRIVILEGES;

-- ダミーデータ
-- users

INSERT INTO users (id, user_name, display_name, password) VALUES
    (UNHEX(LPAD(HEX(1),16,'0')), 'user1', 'User 1', 'pass1'),
    (UNHEX(LPAD(HEX(2),16,'0')), 'user2', 'User 2', 'pass2'),
    (UNHEX(LPAD(HEX(3),16,'0')), 'user3', 'User 3', 'pass3'),
    (UNHEX(LPAD(HEX(4),16,'0')), 'user4', 'User 4', 'pass4'),
    (UNHEX(LPAD(HEX(5),16,'0')), 'user5', 'User 5', 'pass5'),
    (UNHEX(LPAD(HEX(6),16,'0')), 'user6', 'User 6', 'pass6'),
    (UNHEX(LPAD(HEX(7),16,'0')), 'user7', 'User 7', 'pass7'),
    (UNHEX(LPAD(HEX(8),16,'0')), 'user8', 'User 8', 'pass8'),
    (UNHEX(LPAD(HEX(9),16,'0')), 'user9', 'User 9', 'pass9'),
    (UNHEX(LPAD(HEX(10),16,'0')), 'user10', 'User 10', 'pass10'),
    (UNHEX(LPAD(HEX(11),16,'0')), 'user11', 'User 11', 'pass11'),
    (UNHEX(LPAD(HEX(12),16,'0')), 'user12', 'User 12', 'pass12'),
    (UNHEX(LPAD(HEX(13),16,'0')), 'user13', 'User 13', 'pass13'),
    (UNHEX(LPAD(HEX(14),16,'0')), 'user14', 'User 14', 'pass14'),
    (UNHEX(LPAD(HEX(15),16,'0')), 'user15', 'User 15', 'pass15'),
    (UNHEX(LPAD(HEX(16),16,'0')), 'user16', 'User 16', 'pass16'),
    (UNHEX(LPAD(HEX(17),16,'0')), 'user17', 'User 17', 'pass17'),
    (UNHEX(LPAD(HEX(18),16,'0')), 'user18', 'User 18', 'pass18'),
    (UNHEX(LPAD(HEX(19),16,'0')), 'user19', 'User 19', 'pass19'),
    (UNHEX(LPAD(HEX(20),16,'0')), 'user20', 'User 20', 'pass20');

-- デバッグ用ダミーデータ（posts）
-- デバッグ用ダミーデータ（posts）
INSERT INTO posts (id, title, date, category, author) VALUES
    (UNHEX(LPAD(HEX(1),16,'0')), 'Post Title 1', NOW(), 'Category 1', UNHEX(LPAD(HEX(1),16,'0'))),
    (UNHEX(LPAD(HEX(2),16,'0')), 'Post Title 2', NOW(), 'Category 2', UNHEX(LPAD(HEX(2),16,'0'))),
    (UNHEX(LPAD(HEX(3),16,'0')), 'Post Title 3', NOW(), 'Category 3', UNHEX(LPAD(HEX(3),16,'0'))),
    (UNHEX(LPAD(HEX(4),16,'0')), 'Post Title 4', NOW(), 'Category 4', UNHEX(LPAD(HEX(4),16,'0'))),
    (UNHEX(LPAD(HEX(5),16,'0')), 'Post Title 5', NOW(), 'Category 5', UNHEX(LPAD(HEX(5),16,'0'))),
    (UNHEX(LPAD(HEX(6),16,'0')), 'Post Title 6', NOW(), 'Category 1', UNHEX(LPAD(HEX(6),16,'0'))),
    (UNHEX(LPAD(HEX(7),16,'0')), 'Post Title 7', NOW(), 'Category 2', UNHEX(LPAD(HEX(7),16,'0'))),
    (UNHEX(LPAD(HEX(8),16,'0')), 'Post Title 8', NOW(), 'Category 3', UNHEX(LPAD(HEX(8),16,'0'))),
    (UNHEX(LPAD(HEX(9),16,'0')), 'Post Title 9', NOW(), 'Category 4', UNHEX(LPAD(HEX(9),16,'0'))),
    (UNHEX(LPAD(HEX(10),16,'0')), 'Post Title 10', NOW(), 'Category 5', UNHEX(LPAD(HEX(10),16,'0'))),
    (UNHEX(LPAD(HEX(11),16,'0')), 'Post Title 11', NOW(), 'Category 1', UNHEX(LPAD(HEX(11),16,'0'))),
    (UNHEX(LPAD(HEX(12),16,'0')), 'Post Title 12', NOW(), 'Category 2', UNHEX(LPAD(HEX(12),16,'0'))),
    (UNHEX(LPAD(HEX(13),16,'0')), 'Post Title 13', NOW(), 'Category 3', UNHEX(LPAD(HEX(13),16,'0'))),
    (UNHEX(LPAD(HEX(14),16,'0')), 'Post Title 14', NOW(), 'Category 4', UNHEX(LPAD(HEX(14),16,'0'))),
    (UNHEX(LPAD(HEX(15),16,'0')), 'Post Title 15', NOW(), 'Category 5', UNHEX(LPAD(HEX(15),16,'0'))),
    (UNHEX(LPAD(HEX(16),16,'0')), 'Post Title 16', NOW(), 'Category 1', UNHEX(LPAD(HEX(16),16,'0'))),
    (UNHEX(LPAD(HEX(17),16,'0')), 'Post Title 17', NOW(), 'Category 2', UNHEX(LPAD(HEX(17),16,'0'))),
    (UNHEX(LPAD(HEX(18),16,'0')), 'Post Title 18', NOW(), 'Category 3', UNHEX(LPAD(HEX(18),16,'0'))),
    (UNHEX(LPAD(HEX(19),16,'0')), 'Post Title 19', NOW(), 'Category 4', UNHEX(LPAD(HEX(19),16,'0'))),
    (UNHEX(LPAD(HEX(20),16,'0')), 'Post Title 20', NOW(), 'Category 5', UNHEX(LPAD(HEX(20),16,'0')));

-- デバッグ用ダミーデータ（choices）
INSERT INTO choices (post_id, choice, number) VALUES
    (UNHEX(LPAD(HEX(1),16,'0')), 'Choice 1', 1),
    (UNHEX(LPAD(HEX(2),16,'0')), 'Choice 2', 2),
    (UNHEX(LPAD(HEX(3),16,'0')), 'Choice 3', 3),
    (UNHEX(LPAD(HEX(4),16,'0')), 'Choice 4', 4),
    (UNHEX(LPAD(HEX(5),16,'0')), 'Choice 5', 5),
    (UNHEX(LPAD(HEX(6),16,'0')), 'Choice 6', 6),
    (UNHEX(LPAD(HEX(7),16,'0')), 'Choice 7', 7),
    (UNHEX(LPAD(HEX(8),16,'0')), 'Choice 8', 8),
    (UNHEX(LPAD(HEX(9),16,'0')), 'Choice 9', 9),
    (UNHEX(LPAD(HEX(10),16,'0')), 'Choice 10', 10),
    (UNHEX(LPAD(HEX(11),16,'0')), 'Choice 11', 1),
    (UNHEX(LPAD(HEX(12),16,'0')), 'Choice 12', 2),
    (UNHEX(LPAD(HEX(13),16,'0')), 'Choice 13', 3),
    (UNHEX(LPAD(HEX(14),16,'0')), 'Choice 14', 4),
    (UNHEX(LPAD(HEX(15),16,'0')), 'Choice 15', 5),
    (UNHEX(LPAD(HEX(16),16,'0')), 'Choice 16', 6),
    (UNHEX(LPAD(HEX(17),16,'0')), 'Choice 17', 7),
    (UNHEX(LPAD(HEX(18),16,'0')), 'Choice 18', 8),
    (UNHEX(LPAD(HEX(19),16,'0')), 'Choice 19', 9),
    (UNHEX(LPAD(HEX(20),16,'0')), 'Choice 20', 10);
-- デバッグ用ダミーデータ（votes）
INSERT INTO votes (post_id, user_id, number) VALUES
    (UNHEX(LPAD(HEX(1),16,'0')), UNHEX(LPAD(HEX(1),16,'0')), 1),
    (UNHEX(LPAD(HEX(2),16,'0')), UNHEX(LPAD(HEX(2),16,'0')), 2),
    (UNHEX(LPAD(HEX(3),16,'0')), UNHEX(LPAD(HEX(3),16,'0')), 3),
    (UNHEX(LPAD(HEX(4),16,'0')), UNHEX(LPAD(HEX(4),16,'0')), 1),
    (UNHEX(LPAD(HEX(5),16,'0')), UNHEX(LPAD(HEX(5),16,'0')), 2),
    (UNHEX(LPAD(HEX(6),16,'0')), UNHEX(LPAD(HEX(6),16,'0')), 3),
    (UNHEX(LPAD(HEX(7),16,'0')), UNHEX(LPAD(HEX(7),16,'0')), 1),
    (UNHEX(LPAD(HEX(8),16,'0')), UNHEX(LPAD(HEX(8),16,'0')), 2),
    (UNHEX(LPAD(HEX(9),16,'0')), UNHEX(LPAD(HEX(9),16,'0')), 3),
    (UNHEX(LPAD(HEX(10),16,'0')), UNHEX(LPAD(HEX(10),16,'0')), 1),
    (UNHEX(LPAD(HEX(11),16,'0')), UNHEX(LPAD(HEX(11),16,'0')), 2),
    (UNHEX(LPAD(HEX(12),16,'0')), UNHEX(LPAD(HEX(12),16,'0')), 3),
    (UNHEX(LPAD(HEX(13),16,'0')), UNHEX(LPAD(HEX(13),16,'0')), 1),
    (UNHEX(LPAD(HEX(14),16,'0')), UNHEX(LPAD(HEX(14),16,'0')), 2),
    (UNHEX(LPAD(HEX(15),16,'0')), UNHEX(LPAD(HEX(15),16,'0')), 3),
    (UNHEX(LPAD(HEX(16),16,'0')), UNHEX(LPAD(HEX(16),16,'0')), 1),
    (UNHEX(LPAD(HEX(17),16,'0')), UNHEX(LPAD(HEX(17),16,'0')), 2),
    (UNHEX(LPAD(HEX(18),16,'0')), UNHEX(LPAD(HEX(18),16,'0')), 3),
    (UNHEX(LPAD(HEX(19),16,'0')), UNHEX(LPAD(HEX(19),16,'0')), 1),
    (UNHEX(LPAD(HEX(20),16,'0')), UNHEX(LPAD(HEX(20),16,'0')), 2);

FLUSH PRIVILEGES;