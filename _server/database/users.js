"use strict";

const db = require("./DatabaseManager.js");
const bcrypt = require("bcryptjs");

const {generateToken} = require("../utils.js");
const config = require("../../config.js");

async function getById(user_id) {
    const query = `
        SELECT 
            user_name, user_email,
            user_bio, user_token,
            user_status, user_registration
        FROM rs_users
        WHERE user_id = ?`;

    const {data, error} = await db.exec(query, [user_id]);

    if(!error) return { data: data[0] }
    else return {error};
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
    const new_token = generateToken(255);

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

async function update(user_id, {name, email, password, bio, status}) {

    let fields = "";
    let params = [];

    if(name) {
        fields += " user_name = ?";
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

module.exports = {
    getById,
    authenticate,
    updateToken,
    add,
    update,
    remove
}