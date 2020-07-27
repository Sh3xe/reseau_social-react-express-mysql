"use strict";

const db = require("./DatabaseManager.js");

async function add(file_array, post_id) {

    if(!file_array.length) return {error: false, data: null};

    let values = "";
    let params = [];
    for(let file of file_array) {
        values += "(?, ?, ?),";
        params.push(post_id, file.mimetype, file.filename);
    }

    values = values.slice(0, values.length - 1);

    const query = `
        INSERT INTO rs_files(file_post, file_mime, file_name)
        VALUES ${values}`;

    if(values.length) {
        return await db.exec(query, params)
    } else return {error: false, data: null};
}

module.exports = {
    add
}