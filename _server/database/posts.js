"use strict";

const db = require("./DatabaseManager");

async function search({search, category, start, step}) {
    // Giving default values for the params object
    if(!start || !step) {
        start = 0;
        step = 15;
    }

    if(search || category) {

        let params_array = [];
        
        let keywords = null;
        let search_command = null;
        let category_command = null;
        
        if(category && category.length) {
            category_command = "post_category = ?";
            params_array.push(category);
        }

        if(search && search.length) {
            keywords = search.split(/\s|;|:|,/g);

            keywords = keywords.filter(e => {
                return (e !== "");
            });

            search_command = "";

            //[a, b] => "post_title like a OR post_title like b"
            for(let i = 0; i < keywords.length; i++) {
                if(i !== 0) search_command += " OR";
                keywords[i] = `%${keywords[i]}%`;
                search_command += " post_title LIKE ?";
            }
            params_array.push(...keywords);
        }

        /* QUERY:
            if there is a category_command, we add it
            if there is a search_command, we ad it.
            we add an "AND" between them if there is both
        */
        let query = `
            SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, post_category, user_name
            FROM rs_posts FULL JOIN rs_users
            ON user_id = post_user
            WHERE ${category_command || ""}
            ${ (category_command && search_command) ? "AND" : "" }
            ${ search_command ? `(${search_command})` : "" }
            LIMIT ?, ?`;

        //We add the start / step at the end
        params_array.push(start, step)

        return await db.exec(query, params_array);     
    } else {
        const query = `
            SELECT * FROM rs_posts
            LIMIT ?, ?`;
        
        return await db.exec(query, [start, step]);
    }
}

async function getById(id) {
    const query = `
    SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, post_category, user_name
    FROM rs_posts FULL JOIN rs_users
    ON user_id = post_user
    WHERE post_id = ?`;

    return await db.exec(query, [id], true);
}

async function add(title, content, user_id, category) {

    if(!category) category = "Tout";

    const query = `
    INSERT INTO rs_posts(post_title, post_content, post_user, post_category)
    VALUES(?, ?, ?, ?)`;

    const {error} =  await db.exec(query, [title, content, user_id, category]);

    if(!error) return await db.exec("SELECT LAST_INSERT_ID()", []);
    else return error;
}

async function edit(title, content, post_id) {
    const query = `
    UPDATE rs_posts SET
    post_title = ?,
    post_content = ?,
    post_edit_date = NOW()
    WHERE post_id = ?`;
    
    return db.exec(query, [title, content, post_id]);
}

async function remove(post_id) {
    const query = `
    DELETE FROM rs_posts
    WHERE post_id = ?`;
    
    return db.exec(query, [post_id, user_id]);
}

async function voteExists(user, post) {
    const query = `
        SELECT vote_value FROM rs_votes
        WHERE vote_user = ?
        AND vote_post = ?`;

    let {data, error} = await db.exec(query, [user, post], true);

    if(error) return false;
    else return data[0]
}

async function addVote(user, post, value) {

    let vote_exists = await voteExists(user, post);

    if(!vote_exists) {
        const query = `
            INSERT INTO rs_votes(vote_user, vote_post, vote_value)
            VALUES(?, ?, ?)`;

        return db.exec(query, [user, post, value]);
    } else {
        const query = `
            UPDATE rs_votes
            SET vote_value = ?
            WHERE vote_user = ?
            AND vote_post = ?`;
        
        return db.exec(query, [value, user, post]);
    }
}

async function cancelVote(user, post) {
    const query = `
    DELETE FROM rs_votes
    WHERE vote_user = ?
    AND vote_post = ?`;

    return db.exec(query, [user, post]);
}

async function getVotes(post_id) {
    const query = `
        select (select count(vote_value) from rs_votes where vote_value = 1 and vote_post = ?) -
        (select count(vote_value) from rs_votes where vote_value = 0 and vote_post = ?) 
        as value`;
    
    return db.exec(query, [post_id, post_id]);
}

async function getComments(post_id) {
    const query = `
    SELECT * FROM rs_comments
    WHERE comment_post = ?`;

    return db.exec(query, [post_id]);
}


module.exports = {
    getById,
    add,
    edit,
    remove,
    search,
    cancelVote,
    addVote,
    getVotes,
    getComments
}