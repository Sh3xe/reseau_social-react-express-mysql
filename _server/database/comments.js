"use strict";

const db = require("./DatabaseManager.js");

async function add(post, user, content) {
    const query = `
        INSERT INTO rs_comments(comment_post, comment_user, comment_content)
        VALUES(?, ?, ?)`;

    return db.exec(query, [post, user, content]);
}

async function remove(comment_id) {
    const query = `
        DELETE FROM rs_comments
        WHERE comment_id = ?`;

    return db.exec(query, [comment_id]);
}

async function edit(comment_id, content) {
    const query = `
        UPDATE rs_comments
        SET comment_content = ?
        WHERE comment_id = ?`;
    
    return db.exec(query, [content, comment_id]);
}

async function getFromUser(user_id) {
    const query = `
        SELECT * FROM rs_comments
        WHERE comment_user = ?`;
    
    return db.exec(query, [user_id]);
}

async function getFromPost(post_id) {
    const query = `
    SELECT * FROM rs_comments
    WHERE comment_post = ?`;

    return db.exec(query, [post_id]);
}

module.exports = {
    add,
    remove,
    edit,
    getFromPost,
    getFromUser
}