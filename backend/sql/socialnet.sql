-- socialnet.sql
-- Mini Social Networking App schema + sample data

DROP DATABASE IF EXISTS socialnet;
CREATE DATABASE socialnet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE socialnet;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(80) NOT NULL,
  bio VARCHAR(160) NOT NULL DEFAULT '',
  profile_image VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content VARCHAR(800) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT uq_like UNIQUE (post_id, user_id),
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample users
-- NOTE: Replace these password hashes by registering through the app (recommended)
INSERT INTO users (username, password, full_name, bio, profile_image, created_at) VALUES
('alice', '$2y$10$9tQ0g9pYkYw8gZqKQd3u0eQqU2gA2r9Zx2k8e8uB5bW9u6cQx0g5e', 'Alice Santos', 'Hello! I am Alice.', NULL, NOW()),
('bob',   '$2y$10$9tQ0g9pYkYw8gZqKQd3u0eQqU2gA2r9Zx2k8e8uB5bW9u6cQx0g5e', 'Bob Reyes',   'Coffee lover.', NULL, NOW()),
('cara',  '$2y$10$9tQ0g9pYkYw8gZqKQd3u0eQqU2gA2r9Zx2k8e8uB5bW9u6cQx0g5e', 'Cara Dela Cruz', 'Student developer.', NULL, NOW());

-- Sample posts
INSERT INTO posts (user_id, content, image, created_at) VALUES
(1, 'My first post on SocialNet!', NULL, NOW()),
(2, 'Good morning everyone!', NULL, NOW()),
(3, 'Building a mini social network with PHP + React.', NULL, NOW());

-- Sample comments
INSERT INTO comments (post_id, user_id, content, created_at) VALUES
(1, 2, 'Welcome Alice!', NOW()),
(3, 1, 'Nice! Good luck!', NOW());

-- Sample likes
INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(3, 2);
