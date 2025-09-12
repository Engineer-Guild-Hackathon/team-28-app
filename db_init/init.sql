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
    description VARCHAR(1024),
    created_at DATETIME NOT NULL,
    category INT NOT NULL,
    author BINARY(16) NOT NULL,
    FOREIGN KEY (author) REFERENCES users(id)
);

-- choices テーブル
CREATE TABLE choices (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    post_id BINARY(16) NOT NULL,
    choice VARCHAR(64) NOT NULL,
    number INT NOT NULL DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE KEY unique_post_choice_number (post_id, number)
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
INSERT INTO posts (id, title, description, created_at, category, author) VALUES
    (UNHEX(LPAD(HEX(1),16,'0')), 'Post Title 1', 'Description for post 1', NOW(), 3, UNHEX(LPAD(HEX(1),16,'0'))),
    (UNHEX(LPAD(HEX(2),16,'0')), 'Post Title 2', 'Description for post 2', NOW(), 7, UNHEX(LPAD(HEX(2),16,'0'))),
    (UNHEX(LPAD(HEX(3),16,'0')), 'Post Title 3', 'Description for post 3', NOW(), 2, UNHEX(LPAD(HEX(3),16,'0'))),
    (UNHEX(LPAD(HEX(4),16,'0')), 'Post Title 4', 'Description for post 4', NOW(), 5, UNHEX(LPAD(HEX(4),16,'0'))),
    (UNHEX(LPAD(HEX(5),16,'0')), 'Post Title 5', 'Description for post 5', NOW(), 1, UNHEX(LPAD(HEX(5),16,'0'))),
    (UNHEX(LPAD(HEX(6),16,'0')), 'Post Title 6', 'Description for post 6', NOW(), 8, UNHEX(LPAD(HEX(6),16,'0'))),
    (UNHEX(LPAD(HEX(7),16,'0')), 'Post Title 7', 'Description for post 7', NOW(), 4, UNHEX(LPAD(HEX(7),16,'0'))),
    (UNHEX(LPAD(HEX(8),16,'0')), 'Post Title 8', 'Description for post 8', NOW(), 6, UNHEX(LPAD(HEX(8),16,'0'))),
    (UNHEX(LPAD(HEX(9),16,'0')), 'Post Title 9', 'Description for post 9', NOW(), 2, UNHEX(LPAD(HEX(9),16,'0'))),
    (UNHEX(LPAD(HEX(10),16,'0')), 'Post Title 10', 'Description for post 10', NOW(), 7, UNHEX(LPAD(HEX(10),16,'0'))),
    (UNHEX(LPAD(HEX(11),16,'0')), 'Post Title 11', 'Description for post 11', NOW(), 3, UNHEX(LPAD(HEX(11),16,'0'))),
    (UNHEX(LPAD(HEX(12),16,'0')), 'Post Title 12', 'Description for post 12', NOW(), 1, UNHEX(LPAD(HEX(12),16,'0'))),
    (UNHEX(LPAD(HEX(13),16,'0')), 'Post Title 13', 'Description for post 13', NOW(), 8, UNHEX(LPAD(HEX(13),16,'0'))),
    (UNHEX(LPAD(HEX(14),16,'0')), 'Post Title 14', 'Description for post 14', NOW(), 5, UNHEX(LPAD(HEX(14),16,'0'))),
    (UNHEX(LPAD(HEX(15),16,'0')), 'Post Title 15', 'Description for post 15', NOW(), 4, UNHEX(LPAD(HEX(15),16,'0'))),
    (UNHEX(LPAD(HEX(16),16,'0')), 'Post Title 16', 'Description for post 16', NOW(), 6, UNHEX(LPAD(HEX(16),16,'0'))),
    (UNHEX(LPAD(HEX(17),16,'0')), 'Post Title 17', 'Description for post 17', NOW(), 2, UNHEX(LPAD(HEX(17),16,'0'))),
    (UNHEX(LPAD(HEX(18),16,'0')), 'Post Title 18', 'Description for post 18', NOW(), 7, UNHEX(LPAD(HEX(18),16,'0'))),
    (UNHEX(LPAD(HEX(19),16,'0')), 'Post Title 19', 'Description for post 19', NOW(), 1, UNHEX(LPAD(HEX(19),16,'0'))),
    (UNHEX(LPAD(HEX(20),16,'0')), 'Post Title 20', 'Description for post 20', NOW(), 8, UNHEX(LPAD(HEX(20),16,'0')));

-- デバッグ用ダミーデータ（choices）
INSERT INTO choices (post_id, choice, number) VALUES
    -- Post 1 の選択肢
    (UNHEX(LPAD(HEX(1),16,'0')), 'はい', 1),
    (UNHEX(LPAD(HEX(1),16,'0')), 'いいえ', 2),
    (UNHEX(LPAD(HEX(1),16,'0')), 'わからない', 3),
    -- Post 2 の選択肢
    (UNHEX(LPAD(HEX(2),16,'0')), '賛成', 1),
    (UNHEX(LPAD(HEX(2),16,'0')), '反対', 2),
    -- Post 3 の選択肢
    (UNHEX(LPAD(HEX(3),16,'0')), 'A案', 1),
    (UNHEX(LPAD(HEX(3),16,'0')), 'B案', 2),
    (UNHEX(LPAD(HEX(3),16,'0')), 'C案', 3),
    (UNHEX(LPAD(HEX(3),16,'0')), 'D案', 4),
    -- 残りのPostに簡単な選択肢を追加
    (UNHEX(LPAD(HEX(4),16,'0')), 'Option 1', 1),
    (UNHEX(LPAD(HEX(4),16,'0')), 'Option 2', 2),
    (UNHEX(LPAD(HEX(5),16,'0')), 'Yes', 1),
    (UNHEX(LPAD(HEX(5),16,'0')), 'No', 2),
    (UNHEX(LPAD(HEX(6),16,'0')), 'Choice A', 1),
    (UNHEX(LPAD(HEX(6),16,'0')), 'Choice B', 2),
    (UNHEX(LPAD(HEX(7),16,'0')), 'Good', 1),
    (UNHEX(LPAD(HEX(7),16,'0')), 'Bad', 2),
    (UNHEX(LPAD(HEX(8),16,'0')), 'True', 1),
    (UNHEX(LPAD(HEX(8),16,'0')), 'False', 2),
    (UNHEX(LPAD(HEX(9),16,'0')), 'Left', 1),
    (UNHEX(LPAD(HEX(9),16,'0')), 'Right', 2),
    (UNHEX(LPAD(HEX(10),16,'0')), 'Up', 1),
    (UNHEX(LPAD(HEX(10),16,'0')), 'Down', 2),
    (UNHEX(LPAD(HEX(11),16,'0')), 'Red', 1),
    (UNHEX(LPAD(HEX(11),16,'0')), 'Blue', 2),
    (UNHEX(LPAD(HEX(12),16,'0')), 'Cat', 1),
    (UNHEX(LPAD(HEX(12),16,'0')), 'Dog', 2),
    (UNHEX(LPAD(HEX(13),16,'0')), 'Coffee', 1),
    (UNHEX(LPAD(HEX(13),16,'0')), 'Tea', 2),
    (UNHEX(LPAD(HEX(14),16,'0')), 'Summer', 1),
    (UNHEX(LPAD(HEX(14),16,'0')), 'Winter', 2),
    (UNHEX(LPAD(HEX(15),16,'0')), 'Morning', 1),
    (UNHEX(LPAD(HEX(15),16,'0')), 'Night', 2),
    (UNHEX(LPAD(HEX(16),16,'0')), 'City', 1),
    (UNHEX(LPAD(HEX(16),16,'0')), 'Country', 2),
    (UNHEX(LPAD(HEX(17),16,'0')), 'Book', 1),
    (UNHEX(LPAD(HEX(17),16,'0')), 'Movie', 2),
    (UNHEX(LPAD(HEX(18),16,'0')), 'Music', 1),
    (UNHEX(LPAD(HEX(18),16,'0')), 'Art', 2),
    (UNHEX(LPAD(HEX(19),16,'0')), 'Work', 1),
    (UNHEX(LPAD(HEX(19),16,'0')), 'Rest', 2),
    (UNHEX(LPAD(HEX(20),16,'0')), 'Travel', 1),
    (UNHEX(LPAD(HEX(20),16,'0')), 'Home', 2);
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
