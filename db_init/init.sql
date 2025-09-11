CREATE DATABASE IF NOT EXISTS `mydb`;

-- users テーブル
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    displayname VARCHAR(64) NOT NULL,
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