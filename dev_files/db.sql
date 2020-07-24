-- USERS

CREATE TABLE `rs_users`
(
	`user_id` SMALLINT UNSIGNED AUTO_INCREMENT,
	`user_link` VARCHAR(255) UNIQUE,
	`user_name` VARCHAR(100) NOT NULL,
	`user_email` VARCHAR(255) NOT NULL,
	`user_password` CHAR(60) NOT NULL,
	`user_chatkey` VARCHAR(200) NOT NULL,
	`user_registration` DATETIME DEFAULT NOW(),
	`user_bio` TEXT,
	`user_status` VARCHAR(8),
	`user_grade` VARCHAR(8) DEFAULT 'norm',

	PRIMARY KEY(`user_id`)
);

-- POSTS
CREATE TABLE `rs_posts`
(
	`post_id` SMALLINT UNSIGNED AUTO_INCREMENT,
	`post_title` VARCHAR(255) NOT NULL,
	`post_content` TEXT NOT NULL,
	`post_user` SMALLINT UNSIGNED NOT NULL,
	`post_date` DATETIME DEFAULT NOW(),
	`post_edit_date` DATETIME DEFAULT NOW(),

	PRIMARY KEY(`post_id`),
	FOREIGN KEY(`post_user`) REFERENCES `rs_users`(`user_id`)
);

CREATE TABLE `rs_comments`
(
	`comment_id` SMALLINT UNSIGNED AUTO_INCREMENT,
	`comment_post` SMALLINT UNSIGNED NOT NULL,
	`comment_user` SMALLINT UNSIGNED NOT NULL,
	`comment_content` VARCHAR(250) NOT NULL,
	`comment_date` DATETIME DEFAULT NOW(),
	
	PRIMARY KEY(`comment_id`),
	FOREIGN KEY(`comment_post`) REFERENCES `rs_posts`(`post_id`),
	FOREIGN KEY(`comment_user`) REFERENCES `rs_users`(`user_id`)
);

CREATE TABLE `rs_answers`
(
	`answer_comment` SMALLINT UNSIGNED NOT NULL,
	`answer_user` SMALLINT UNSIGNED NOT NULL,
	`answer_content` VARCHAR(250) NOT NULL,
	`answer_date` DATETIME DEFAULT NOW(),

	FOREIGN KEY(`answer_comment`) REFERENCES `rs_comments`(`comment_id`),
	FOREIGN KEY(`answer_user`) REFERENCES `rs_users`(`user_id`)
);

--RELATIONS
CREATE TABLE `rs_relations`
(
	`relation_user1` SMALLINT UNSIGNED NOT NULL,
	`relation_user2` SMALLINT UNSIGNED NOT NULL,
	`relation_status` VARCHAR(8) NOT NULL, --add not null

	FOREIGN KEY(`relation_user1`) REFERENCES `rs_users`(`user_id`),
	FOREIGN KEY(`relation_user2`) REFERENCES `rs_users`(`user_id`)
);

--CHATS
CREATE TABLE `rs_chatrooms` 
(
	`chatroom_id` SMALLINT UNSIGNED AUTO_INCREMENT,
	`chatroom_admin` SMALLINT UNSIGNED NOT NULL,
	`chatroom_name` VARCHAR(100) NOT NULL,
	`chatroom_password_required` BOOLEAN DEFAULT 0,
	`chatroom_grant_required` BOOLEAN DEFAULT 1,
	`chatroom_password` VARCHAR(32) NOT NULL,
	`chatroom_creation_date` DATETIME DEFAULT NOW(),

	PRIMARY KEY(`chatroom_id`),
	FOREIGN KEY(`chatroom_admin`) REFERENCES `rs_users`(`user_id`)
);

CREATE TABLE `rs_chat_messages`
(
	`message_user` SMALLINT UNSIGNED NOT NULL,
	`message_content` VARCHAR(250) NOT NULL,
	`message_date` DATETIME DEFAULT NOW(),
	`message_chatroom` SMALLINT UNSIGNED NOT NULL,
	
	FOREIGN KEY(`message_user`) REFERENCES `rs_users`(`user_id`),
	FOREIGN KEY(`message_chatroom`) REFERENCES `rs_chatrooms`(`chatroom_id`)
);

CREATE TABLE `rs_private_messages` 
(
	`mp_user` SMALLINT UNSIGNED NOT NULL,
	`mp_content` VARCHAR(255) NOT NULL,
	`mp_date` DATETIME DEFAULT NOW(),

	FOREIGN KEY(`mp_user`) REFERENCES `rs_users`(`user_id`)
);

CREATE TABLE `rs_chatroom_grants` 
(
	`grant_chatroom` SMALLINT UNSIGNED NOT NULL,
	`grant_user` SMALLINT UNSIGNED NOT NULL,

	FOREIGN KEY(`grant_chatroom`) REFERENCES `rs_chatrooms`(`chatroom_id`),
	FOREIGN KEY(`grant_user`) REFERENCES `rs_users`(`user_id`)
);

-- REPORTS AND VOTES
CREATE TABLE `rs_reports`
(
	`report_user` SMALLINT UNSIGNED NOT NULL,
	`report_post` SMALLINT UNSIGNED,
	`report_comment` SMALLINT UNSIGNED,
	`report_reason` VARCHAR(250) NOT NULL,
	
	FOREIGN KEY(`report_user`) REFERENCES `rs_users`(`user_id`),
	FOREIGN KEY(`report_post`) REFERENCES `rs_posts`(`post_id`),
	FOREIGN KEY(`report_comment`) REFERENCES `rs_comments`(`comment_id`)
);

CREATE TABLE `rs_votes`
(
	`vote_user` SMALLINT UNSIGNED NOT NULL,
	`vote_post` SMALLINT UNSIGNED NOT NULL,
	`vote_value` BIT(1) NOT NULL,
	
	FOREIGN KEY(`vote_user`) REFERENCES `rs_users`(`user_id`),
	FOREIGN KEY(`vote_post`) REFERENCES `rs_posts`(`post_id`)
);

--FILES
CREATE TABLE `rs_files`
(
	`file_post` SMALLINT UNSIGNED NOT NULL,
	`file_path` VARCHAR(255) NOT NULL,
	`file_type` VARCHAR(8) NOT NULL,

	FOREIGN KEY(file_post) REFERENCES `rs_posts`(`post_id`)
);