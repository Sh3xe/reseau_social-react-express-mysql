"use strict";

const db = require("./DatabaseManager.js");

//CRUD
function search(is_private, user_id, {search_query, start, step}) {
    //Add default value
    if(start === undefined) start = 0;
    if(step === undefined) step = 8;

    //Init variables
    let search_command = "";
    let params = [];

    //Get search_command
    if(search_query) {
        //Get a keywords array
        let keywords = search_query.split(/\s|;|,|:/g);
        //remove the empty elements
        keywords = keywords.filter(e => e !== "");

        for(let i = 0; i < keywords.length; i++) {
            if(i !== 0) search_command += " OR";
            search_command += " chatroom_name LIKE ?";
            params.push(`%${keywords[i]}%`);
        }
    }

    if(is_private) params.push(user_id, user_id);

    //Puting together the query
    const query = `
        SELECT chatroom_id, chatroom_admin, user_name, chatroom_name, chatroom_creation_date, chatroom_type
        FROM rs_chatrooms FULL JOIN rs_users
        ON chatroom_admin = user_id
        ${search_command ? `WHERE ${search_command}` : ""}
        ${search_command ? "AND" : "WHERE"}
        chatroom_type = "${is_private ? "private": "public"}"
        ${is_private ? `
        AND chatroom_id IN (SELECT grant_chatroom FROM rs_chatroom_grants WHERE grant_user = ?)
        OR chatroom_admin = ?` : ""}
        LIMIT ?, ?`;


    params.push(start, step);

    //Executing
    return db.exec(query, params);
}

function add({name, is_private, user_id}) {
    const query = `
        INSERT INTO rs_chatrooms (chatroom_admin, chatroom_name, chatroom_is_private)
        VALUES(?, ?, ?)`;
    
    return db.exec(query, [user_id, name, is_private]);
}

function remove(id, user) {
    const query = `
        DELETE FROM rs_chatrooms
        WHERE chatroom_id = ?
        AND chatroom_admin = ?`;

    return db.exec(query, [id, user]);
}

function update(chatroom_id, user_id, {name, type}) {
    //Init query and params
    let update_command = "";
    let params = [];

    //add the SET key = value when we need to
    if(name !== undefined) {
        update_command += ",chatroom_name = ?";
        params.push(name);
    }

    if(type !== undefined) {
        update_command += ",chatroom_type = ?";
        params.push(type);
    }

    //Remove the first ","
    update_command = update_command.substr(1, update_command.length);

    //Add everything to a query.
    const query = `
        UPDATE rs_chatrooms
        SET ${update_command}
        WHERE chatroom_id = ?
        AND chatroom_admin = ?`;

    //add the last 2 parameters
    params.push(chatroom_id, user_id);

    //execute query
    return db.exec(query, params);
}

function get(chatroom_id) {
    const query = `
        SELECT * FROM rs_chatrooms
        WHERE chatroom_id = ?`;

    return db.exec(query, [chatroom_id], true);
}

//MESSAGES get/add/remove
async function sendPrivateMessage(user_from, user_to, content) {
    const query = `
        INSERT INTO rs_private_messages (mp_from, mp_to, mp_content)
        VALUES (?, ?, ?)`;

    return db.exec(query, [user_from, user_to, content]);
}

async function removePrivateMessage(user_from, message_id) {
    const query = `
        DELETE FROM rs_private_messages
        WHERE mp_id = ?
        AND mp_from = ?`;

    return db.exec(query, [message_id, user_from]);
}

async function getPrivateMessages(user1, user2, {start, step}) { // PAS FINI

    if(start === undefined) {
        start = 0;
    }

    if(step === undefined) {
        step = 30;
    }

    const query = `
        SELECT mp_content, mp_date, mp_from, mp_to, user_name
        FROM rs_private_messages
        FULL JOIN rs_users
        ON mp_from = user_id OR mp_to = user_id
        WHERE (mp_from = ? AND mp_to = ?) OR (mp_from = ? AND mp_to = ?)
        ORDER BY mp_date DESC 
        LIMIT ?, ?`;

    return db.exec(query, [user1, user2, user2, user1, start, step]);
}

function sendMessage(user_id, chatroom_id, content) {
    const query = `
        INSERT INTO rs_chat_messages(message_user, message_chatroom, message_content)
        VALUES (?, ?, ?)`;

    return db.exec(query, [user_id, chatroom_id, content]);
}

async function removeMessage(user_id, message_id) {
    const query = `
        DELETE FROM rs_chat_messages
        WHERE message_user = ? 
        AND message_id = ?`;

    return db.exec(query, [user_id, message_id]);
}

async function getMessages(chatroom_id, {start, step}) {

    if(start === undefined) {
        start = 0;
    }

    if(step === undefined) {
        step = 30;
    }

    const query = `
        SELECT message_content, message_date, message_user, message_chatroom, message_id,
        user_name, user_avatar, user_id, user_registration
        FROM rs_chat_messages FULL JOIN rs_users
        ON message_user = user_id
        WHERE message_chatroom = ?
        ORDER BY message_date DESC
        LIMIT ?, ?`;

    return db.exec(query, [chatroom_id, start, step])
}

//GRANTS
function grantUser(user_id, chatroom_id) {
    //!\ NO PROTECTION: use "isAdmin" to see if the grant is allowed
    const query = `
        INSERT INTO rs_chatroom_grants (grant_chatroom, grant_user)
        VALUES (?, ?)`;

    return db.exec(query, [chatroom_id, user_id])
}

function removeGrant(user_id, chatroom_id) {
    //!\ NO PROTECTION: use "isAdmin" to see if the grant is allowed
    const query = `
        DELETE FROM rs_chatroom_grants
        WHERE grant_user = ?
        AND grant_chatroom = ?`;

    return db.exec(query, [user_id, chatroom_id]);
}

//GET
function getAllowedUsers(chatroom_id) {
    const query = `
        SELECT grant_user
        FROM rs_chatroom_grants
        WHERE grant_chatroom = ?`;
    
    return db.exec(query, [chatroom_id]);
}

async function isChatroomAdmin(user_id, chatroom_id) {
    const query = `
        SELECT * FROM rs_chatrooms
        WHERE chatroom_id = ?
        AND chatroom_admin = ?`;

    const {error} = await db.exec(query, [chatroom_id, user_id], true);

    return !error ? true : false;
}

async function isUserAllowed(user_id, chatroom_id) {

    const {data} = await get(chatroom_id);
    
    if(!data[0]) {
        return false;
    }

    if(data[0].chatroom_admin === user_id || data[0].chatroom_type === "public") {
        return true;
    }

    const query = `
        SELECT * FROM rs_chatroom_grants
        WHERE grant_user = ?
        AND grant_chatroom = ?`;

    const {error} = await db.exec(query, [user_id, chatroom_id], true);
    return error ? false : true;
}

module.exports = {
    get,
    search,
    add,
    remove,
    update,
    getMessages,
    getPrivateMessages,
    grantUser,
    removeGrant,
    sendPrivateMessage,
    removePrivateMessage,
    sendMessage,
    removeMessage,
    getAllowedUsers,
    isChatroomAdmin,
    isUserAllowed
}