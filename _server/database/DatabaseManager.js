"use strict";

const config = require("../config.js");
const mysql = require("mysql2");

class DataBase {

    constructor({host, user, database, password}) {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            user,
            host,
            password,
            database
        });
    }

    exec(query, params, res_required = false) {
        // return an error and a data object
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((error, connection)=>{
                if(error) resolve({error: "Could not get a connection"});
                else {
                    connection.execute(query, params, (err, res, fld)=>{
                        if (err) resolve({error: err});
                        else if (!res.length && res_required) resolve({error: "no result"});
                        else resolve({data: res});
                        connection.release();
                    });
                }
            });
        });
    }
}

module.exports = new DataBase(config);