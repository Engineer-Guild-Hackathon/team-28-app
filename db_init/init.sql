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
    (UNHEX(LPAD(HEX(10),16,'0')), 'user10', 'User 10', 'pass10');
