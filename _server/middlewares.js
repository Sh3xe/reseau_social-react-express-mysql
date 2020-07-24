"use strict";

const users = require("./database/users.js");
const chalk = require("chalk");

function logRequests(req, res, next) {
    console.log(`${chalk.bgBlueBright(req.method)} ${chalk.blueBright(req.url)}`);
    next();
}

/*
if(req.session.user){
    const {error, data} = await users.getById(req.session.user.user_id);
    if(!error) {
        console.log(data)
        req.user = data;
        next();
    }
}
next();
*/


async function authenticate(req, res, next) {
    /*
    try {
        if(req.session.user) 
        const {error, data} = await users.getByToken(req.session.user_token);
        if(!error) {
            req.session.user = data;
        }
    } catch(e) {}*/
}

module.exports = {
    logRequests,
    authenticate
}