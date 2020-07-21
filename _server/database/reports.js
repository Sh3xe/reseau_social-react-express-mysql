const db = require("./DatabaseManager.js");

async function reportPost(user, post, reason) {
    const query = `
        INSERT INTO rs_reports (report_user, report_post, report_reason)
        VALUES(?, ?, ?)`;
    
    return db.exec(query, [user, post, reason]);
}

async function reportComment(user, comment, reason) {
    const query = `
        INSERT INTO rs_reports (report_user, report_comment, report_reason)
        VALUES(?, ?, ?)`;
    
    return db.exec(query, [user, comment, reason]);
}

async function getReportsOfComment(comment_id) {
    const query = `
        SELECT * FROM rs_reports
        WHERE report_comment = ?`;
    
    return db.exec(query, [comment_id]);
}

async function getReportsOfPost(post_id) {
    const query = `
        SELECT * FROM rs_reports
        WHERE report_post = ?`;
    
    return db.exec(query, [post_id]);
}

module.exports = {
    reportPost,
    reportComment,       //A tester
    getReportsOfComment, //A tester
    getReportsOfPost
}