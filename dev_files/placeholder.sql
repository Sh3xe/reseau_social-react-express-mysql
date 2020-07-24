/* 
| user_id           | smallint unsigned | NO   | PRI | NULL              | auto_increment    |
| user_link         | varchar(255)      | YES  | UNI | NULL              |                   |
| user_name         | varchar(100)      | NO   |     | NULL              |                   |
| user_email        | varchar(255)      | NO   |     | NULL              |                   |
| user_password     | char(60)          | NO   |     | NULL              |                   |
| user_chatkey      | varchar(200)      | NO   |     | NULL              |                   |
| user_registration | datetime          | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| user_bio          | text              | YES  |     | NULL              |                   |
| user_status       | varchar(8)        | YES  |     | NULL              |                   |
| user_grade        | varchar(8)        | YES  |     | norm              |                   |
*/

-- $2y$10$4eWRuoTXmI32T2VwQAjCP.SoEi4qvtinaQiUux3A7XU0b6R0Dcxlq (motdepasse)
-- $2y$10$1o9x..J7oO..J2SmCEyv6.HDO6WgrkFpTq806dySAieXKBqfKd9B6 (mdp123456)

INSERT INTO rs_users( user_name, user_email, user_password, user_chatkey, user_status) VALUES("/Sh3xeee/", "qwerlyz666@gmail.com", "$2y$10$4eWRuoTXmI32T2VwQAjCP.SoEi4qvtinaQiUux3A7XU0b6R0Dcxlq", "u253qWGNGlRQ6b6FQKzKPBftaAm9D49GmI0bzc3RzRFaxKiVRfBhNeNOk5fBGBNqpUDAV5dbV8plrqBZ", "ok"), ("Utilisateur TEST", "a@a.a", "$2y$10$1o9x..J7oO..J2SmCEyv6.HDO6WgrkFpTq806dySAieXKBqfKd9B6", "b5pJ8MdSiruWum8BluWMdhLt0qVjF7ltoxI8Pu5K7lS0H1TFiUUuebUHjoe9KoVdjHsc4SCzYFdEDo5X", "ok") 

/*
| post_id        | smallint unsigned | NO   | PRI | NULL              | auto_increment    |
| post_title     | varchar(255)      | NO   |     | NULL              |                   |
| post_content   | text              | NO   |     | NULL              |                   |
| post_file_path | varchar(255)      | YES  |     | NULL              |                   |
| post_user      | smallint unsigned | NO   | MUL | NULL              |                   |
| post_date      | datetime          | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| post_edit_date | datetime          | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
*/

INSERT INTO rs_posts(post_title, post_content, post_user) VALUES("Mon premier post!!!", "Pour aller au travail, Marc porte une veste, un pantalon, une chemise et une belle cravate rouge. Ses amis trouvent qu’il est très élégant avec son bracelet-montre doré et ses chaussures noires.
Quand il doit rencontrer un client important, Marc n’hésite pas à s’habiller sobrement. Il met son plus beau costume et son chapeau. Il se sent plus à l’aise avec une tenue vestimentaire classique. Sa secrétaire Lili porte des lunettes. Elle adore mettre sa jupe à fleurs et un chemisier assorti lorsqu’il fait beau. En hiver, elle ne sort jamais sans son parapluie et son écharpe. Elle préfère aussi mettre un pull, des chaussettes en laine, des bottes et ses gants pour ne pas avoir froid aux doigts. Parfois, elle exhibe un joli collier en perles autour du cou qui lui donne une allure très attrayante. En été, lorsqu’il fait chaud, Lili et Marc vont à plage pendant le weekend. Ils mettent des lunettes de soleil, une belle casquette, un T-shirt, des shorts et des sandales. Ils aiment passer des journées ensemble au bord de la mer.", 1),("BONBONBON", "C'est tout.", 1), ("NONONO", "nonono", 2), ("YESYESYES", "yesyesyes", 2);

INSERT INTO rs_comments(comment_post, comment_user, comment_content) VALUES (2, 2, "MERCI!! je cherchais la réponse!!"), (2, 1, ":/");

SELECT * from rs_relations
FULL JOIN rs_users 
ON rs_relations.relation_user1 = rs_users.user_id
AND rs_relations.relation_user2 = rs_users.user_id
WHERE relation_user1 = 1 OR relation_user2 = 1;