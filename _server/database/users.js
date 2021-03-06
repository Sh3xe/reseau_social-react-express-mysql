"use strict";

const db = require("./DatabaseManager.js");
const bcrypt = require("bcryptjs");

const {generateToken, objectToKeyValue} = require("../utils.js");
const config = require("../../config.js");

async function search({search_query, start, step}) {
    // Giving default values for the params object
    if(!start || !step) {
        start = 0;
        step = 15;
    }

    if(search_query) {
        let query = `
            SELECT user_name, user_id, user_registration, user_avatar FROM rs_users
            WHERE user_name LIKE ?
            LIMIT ?, ?`;

        return await db.exec(query, [`%${search_query}%`, start, step]);     
    } else {
        const query = `
            SELECT user_name, user_id, user_registration, user_avatar FROM rs_users
            LIMIT ?, ?`;
        
        return await db.exec(query, [start, step]);
    }
}

async function getByToken(user_token) {
    const query = `
        SELECT 
            user_name, user_bio,
            user_token, user_status, 
            user_registration, user_id, 
            user_avatar, user_colors,
            user_email
        FROM rs_users
        WHERE user_token = ?`;

    const {data, error} = await db.exec(query, [user_token]);
    return error ? error : {data: data[0]};
}

async function getById(user_id) {
    const query = `
        SELECT 
            user_name, user_bio,
            user_token, user_status, 
            user_registration, user_id, 
            user_avatar, user_colors
        FROM rs_users
        WHERE user_id = ?`;

    const {data, error} = await db.exec(query, [user_id]);
    return error ? error : {data: data[0]};
}

async function authenticate(email, password) {

    const query = `
        SELECT * FROM rs_users
        WHERE user_email = ?`;

    const {error, data} = await db.exec(query, [email], true);
    
    if(!error) {
        const res = bcrypt.compareSync(password, data[0].user_password);

        if(!res) return {error: "Incorrect password"};
        else {
            data[0].user_password = undefined;
            return { data: data[0] };
        }
    } else {
        if(error === "no result") return { error: "Incorrect e-mail" }
        else return null;
    }
}

async function updateToken(user_id) {
    const new_token = generateToken();

    const query = `
        UPDATE rs_users
        SET user_token = ?
        WHERE user_id = ? `;
    
    const {error, data} = await db.exec(query, [new_token, user_id]);

    if(!error) return {error, data: new_token};
    else return {error, data};
}

async function add(name, email, password) {
    const query = `
        INSERT INTO rs_users(user_email, user_password, user_name, user_token)
        VALUES(?, ?, ?, ?) `;

    const salt = bcrypt.genSaltSync(config.saltRounds);
    const hashed_password = bcrypt.hashSync(password, salt);
    const token = generateToken();

    return await db.exec(query, [email, hashed_password, name, token ]);
}

async function update(user_id, {name, email, password, bio, status, avatar, colors}) {
    let fields = "";
    let params = [];

    if(colors) {
        fields += " user_colors = ?,";

        const parsed_colors = objectToKeyValue(colors);
        params.push(parsed_colors);
    }

    if(name) {
        fields += " user_name = ?,";
        params.push(name);
    }

    if(email) {
        fields += " user_email = ?,";
        params.push(email);
    }

    if(bio) {
        fields += " user_bio = ?,";
        params.push(bio);
    }

    if(status) {
        fields += " user_status = ?,";
        params.push(status);
    }

    if(password) {
        fields += " user_password = ?,";

        const salt = bcrypt.genSaltSync(config.saltRounds);
        const hashed_password = bcrypt.hashSync(password, salt);

        params.push(hashed_password);
    }

    if(avatar) {
        fields += " user_avatar = ?,"
        params.push(avatar);
    }

    fields = fields.slice(0, fields.length - 1);

    const query = `
        UPDATE rs_users 
        SET ${fields}
        WHERE user_id = ?`;

    params.push(user_id);

    return await db.exec(query, params);
}

async function remove(user_id) {
    const query = `
        DELETE FROM rs_users
        WHERE user_id = ? `;

    return await db.exec(query, [user_id]);
}

async function getComments(user_id) {
    const query = `
        SELECT * FROM rs_comments
        WHERE comment_user = ?`;
    
    return db.exec(query, [user_id]);
}

async function getPosts(id, start, step) {
    const query = `
    SELECT post_id, post_title, post_content, post_user, post_date, post_edit_date, user_name, user_avatar
    FROM rs_posts
    FULL JOIN rs_users
    ON post_user = user_id
    WHERE user_id = ?
    LIMIT ?, ?`;
    
    return await db.exec(query, [id, start, step]);
}

async function getFriends(user_id) {
    const query = `
        SELECT relation_date, relation_user1, relation_user2, user_id, user_name, user_registration, user_status, user_avatar
        FROM rs_relations FULL JOIN rs_users
        ON relation_user1 = user_id
        OR relation_user2 = user_id
        WHERE (relation_user1 = ? OR relation_user2 = ?)
        AND relation_status = "friends" 
        AND user_id != ? `;
    
    return db.exec(query, [user_id, user_id, user_id]);
}

async function getRequests(user_id){
    const query = `
        SELECT relation_user1, relation_user2, user_id, user_name, user_registration, user_status
        FROM rs_relations FULL JOIN rs_users
        ON relation_user1 = user_id
        OR relation_user2 = user_id
        WHERE (relation_user1 = ? OR relation_user2 = ?)
        AND relation_status = "pending" 
        AND user_id != ?`;
    
    return db.exec(query, [user_id, user_id, user_id]);
}

/*
async function getStats(user_id) {
    const query = `
        SELECT COUNT(post_views), COUNT(*)
        FROM rs_posts WHERE post_user = ?`;

    return db.exec(query, user_id);
}
*/

module.exports = {
    getByToken,
    getById,
    authenticate,
    updateToken,
    add,
    update,
    remove,
    getComments,
    getPosts,
    getFriends,
    getRequests,
    search
}