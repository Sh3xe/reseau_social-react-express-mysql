"use strict";

const express = require("express");
const router = express.Router();

const loginRequired = require("./loginRequired.js");
const users = require("../database/users.js");

router.get("/current_user", loginRequired, async(req, res) => {
    const {data, error} = await users.getByToken(req.session.user_token);

    if(!error) {
        res.json(data);
    } else {
        res.status(400);
        res.end();
    }
});

module.exports = router;