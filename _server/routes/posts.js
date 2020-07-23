"use strict";

const express = require("express");
const router = express.Router();

const posts = require("../database/posts.js");

router.get("/post/:id", async(req, res) => {

    if(!isNaN(req.params.id)) {

        const {error, data} = await posts.getById(req.params.id);

        if(!error) {
            res.json(data[0]);

        } else {
            if(error === "no result") res.writeHead(404);
            else rs.writeHead(500);
            res.end();
        }
    }
});

router.get("/posts", async(req, res) => {

    const {error, data} = await posts.search(req.query);

    if(!error) {
        res.json(data);
    } else {
        res.writeHead(500);
        res.end();
    }
});

module.exports = router;