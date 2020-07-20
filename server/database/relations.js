"use strict";
const db = require("./DatabaseManager");

async function relationExists(u1, u2, order_matter = false) {
    // if the order matter, we select only if the From user sent the request
    // else we select any relation with from and to 
    const query = order_matter ? `
        SELECT relation_status FROM rs_relations
        WHERE relation_user1 = ? AND relation_user2 = ?`: `
        SELECT relation_status FROM rs_relations
        WHERE relation_user1 = ? AND relation_user2 = ?
        OR    relation_user2 = ? AND relation_user1 = ? `;

    let {error, data} = await db.exec(query, [u1, u2, u1, u2], true);
    if(error) return false;
    else return data[0];
}

async function sendRequest(from, to) {
    const curr_relation = await relationExists(from, to);
    if(curr_relation) return {error: "Relation already exists"};

    const query = `
        INSERT INTO rs_relations(relation_user1, relation_user2, relation_status)
        VALUES(?, ?, ?)`;
        
    return await db.exec(query, [from, to, "pending"]);
}

async function acceptRequest(from, to) {
    const curr_relation = relationExists(from, to, true);
    if(!curr_relation) return {error: "No relation between user 1 and user 2"};

    const query = `
        UPDATE rs_relations
        SET relation_status = "friends"
        WHERE relation_user2 = ? AND relation_user1 = ? `;

    return db.exec(query, [from, to]);
}


async function removeRelation(from, to) {
    const query = `
        DELETE FROM rs_relations
        WHERE relation_user1 = ? AND relation_user2 = ?
        OR    relation_user2 = ? AND relation_user1 = ? `;

    return db.exec(query, [from, to, from, to]);
}

/*async function getFriendsOf(user_id) {
    const query = `
        SELECT user_link, user_name, user_registration, user_status, user_grade
        FROM rs_users LEFT JOIN rs_relations
        ON  rs_users.user_id = rs_relations.relation_user1 
        AND rs_users.user_id = rs_relations.relation_user2 
        WHERE (rs_relations.relation_user1 = ? OR rs_relations.relation_user2 = ?)
        AND rs_relations.relation_status = "friend" `;
    
    return db.exec(query, [id, id]);
}*/

//async function getRequestsOf(user_id)

module.exports = {
    sendRequest,
    acceptRequest,
    removeRelation
}