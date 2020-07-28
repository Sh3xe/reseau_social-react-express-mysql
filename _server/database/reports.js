"use strict";

const db = require("./DatabaseManager.js");

async function reportExists({user, post, comment}){
    if(!user || (!post && !comment)) return null;

    let query = "";
    let params = [user];

    if(comment) {
        query = `
            SELECT * FROM rs_reports
            WHERE report_user = ?
            AND report_comment = ?`;
        params.push(comment);

    } else if(post) {
        query = `
            SELECT * FROM rs_reports
            WHERE report_user = ?
            AND report_post = ?`;
        params.push(post);

    }

    const {error, d} = await db.exec(query, params, true);
    
    if(!error) return true;
    else return false;
}

async function report({user, post, comment, reason}) {
    if(!user || (!post && !comment)) return {error: true};
    if(await reportExists({user, post, comment})) return {error: true};
    
    if(!reason) reason = "";

    let query = "";
    let params = [];
    
    if(comment) {
        query = `
            INSERT INTO rs_reports (report_user, report_comment, report_reason)
            VALUES(?, ?, ?)`;

        params = [user, comment, reason];

    } else if(post) {
        query = `
            INSERT INTO rs_reports (report_user, report_post, report_reason)
            VALUES(?, ?, ?)`;

        params = [user, post, reason];
    }

    return await db.exec(query, params);
}

async function getReportsOf({user, comment, post}) {

    let query = "SELECT * FROM rs_reports ";
    let params = [];

    if(user) {
        query += "WHERE report_user = ?";
        params = [user];

    } else if(comment) {
        query += "WHERE report_comment = ?";
        params = [comment];

    } else if(post) {
        query += "WHERE report_post = ?";
        params = [post];
    }

    console.log(query, params)

    if(query)
        return await db.exec(query, params);
    else return null;
}

async function deleteReportsOf({comment, user, post}){
    let query = "DELETE FROM rs_reports ";
    let params = [];

    if(user) {
        query += "WHERE report_user = ?";
        params = [user];

    } else if(comment) {
        query += "WHERE report_comment = ?";
        params = [comment];

    } else if(post) {
        query += "WHERE report_post = ?";
        params = [post];
    }

    if(query)
        return await db.exec(query, params);
    else return null;
}

module.exports = {
    report,
    getReportsOf,
    deleteReportsOf
}