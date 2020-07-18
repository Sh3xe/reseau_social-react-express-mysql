"use strict";
let db = require("./DatabaseManager");

async function searchPost(params = {
    start: 0,
    step: 15,
    search_query: null,
    category: null
}) {
    if(!params.start || !params.step) {
        params.start = 0;
        params.step = 15;
    }

    if(params.search_query || params.category) {

        let params_array = [];
        
        let keywords = null;
        let search_command = null;
        let category_command = null;
        
        if(params.category) {
            category_command = "post_category = ?";
            params_array.push(params.category);
        }

        if(params.search_query) {
            keywords = params.search_query.split(/\s|;|:|,/g);
            search_command = "";

            for(let i = 0; i < keywords.length; i++) {
                if(i !== 0) search_command += " OR";
                keywords[i] = `%${keywords[i]}%`;
                search_command += " post_title LIKE ?";
            }
            params_array.push(...keywords);
        }
        
        let query = `
            SELECT * FROM rs_posts
            WHERE ${category_command || ""}
            ${ (category_command && search_command) ? "AND" : "" }
            (${search_command || ""})
            LIMIT ?, ?`;

        params_array.push(params.start, params.step)

        return await db.exec(query, params_array);     
    } else {
        const query = `
            SELECT * FROM rs_posts
            LIMIT ?, ?`;
        
        return await db.exec(query, [params.start, params.step]);
    }
}

async function getPostById(id) {
    const query = `
        SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, user_name, user_link
        FROM rs_posts
        INNER JOIN rs_users
        ON rs_posts.post_user = rs_users.user_id
        WHERE post_id = ?`;

    return await db.exec(query, [id], true);
}

async function getPostsOf(id) {
    const query = `
    SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, user_name, user_link
    FROM rs_posts
    INNER JOIN rs_users
    ON rs_posts.post_user = rs_users.user_id
    WHERE user_id = ?`;

    return await db.exec(query, [id], true);
}

async function addPost(title, content, user_id) {
    const query = `
        INSERT INTO rs_posts(post_title, post_content, post_user)
        VALUES(?, ?, ?)`;
    
    return await db.exec(query, [title, content, user_id]);
}

async function editPost(title, content, user_id, post_id) {
    const query = `
        UPDATE rs_posts SET
        post_title = ?,
        post_content = ?,
        post_edit_date = NOW()
        WHERE post_id = ? AND post_user = ?`;

    return db.exec(query, [title, content, post_id, user_id]);
}

async function deletePost(post_id, user_id) {
    const query = `
        DELETE FROM rs_posts
        WHERE post_id = ?
        AND post_user = ?`;
    
    return db.exec(query, [post_id, user_id]);
}

module.exports = {
    getPostById,
    getPostsOf,
    addPost,
    editPost,
    deletePost,
    searchPost
}