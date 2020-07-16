"use strict";
let db = require("./DatabaseManager");

async function getPostById(id) {
    const query = `
        SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, user_name, user_link
        FROM rs_posts
        INNER JOIN rs_users
        ON rs_posts.post_user = rs_users.user_id
        WHERE post_id = ?
    `;
    return await db.exec(query, [id], true);
}

async function getPostsOf(id) {
    const query = `
    SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, user_name, user_link
    FROM rs_posts
    INNER JOIN rs_users
    ON rs_posts.post_user = rs_users.user_id
    WHERE user_id = ?
    `;
    return await db.exec(query, [id], true);
}

module.exports = {
    getPostById,
    getPostsOf
}