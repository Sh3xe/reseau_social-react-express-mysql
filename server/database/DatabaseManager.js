const mysql = require("mysql2");

export class DatabaseManager {

    constructor({host, user, database, password}) {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            user,
            host,
            password,
            database
        });
    }

    async exec(query, params) {
        this.pool.getConnection((error, connection)=> {
            if(error) throw error;
            connection.execute(query,params, (err, res, fld) => {
                if(err) {
                    this.pool.releaseConnection(connection);
                    throw err;
                } else {
                    this.pool.releaseConnection(connection);
                    return res;
                }
            });
        });
    }
}