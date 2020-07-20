"use strict";

const express = require("express");
const router = express.Router();

const posts = require("../database/posts.js");

router.get("/post/:id", async(req, res) => {
    const {error, data} = await posts.getPostById(req.params.id);
    if(!error) {
        res.json(data);
    } else res.status(404).end();
});

module.exports = router;