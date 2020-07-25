"use strict";

const users = require("./database/users.js");
const chalk = require("chalk");

function logRequests(req, res, next) {
    console.log(`${chalk.bgBlueBright(req.method)} ${chalk.blueBright(req.url)}`);
    next();
}

async function authenticate(req, res, next) {
    /*
    try {
        let error
        if(req.session.user) {
            const {error, data} = await users.getByToken(req.session.user_token);
        }
        if(!error) {
            req.user = data;
        }
    } catch(e) {}*/
}

module.exports = {
    logRequests,
    authenticate
}