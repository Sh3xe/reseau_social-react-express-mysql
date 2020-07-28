"use strict";

const express = require("express");
const multer = require("multer");
const router = express.Router();

const loginRequired = require("./loginRequired.js");
const utils = require("../utils.js");
const config = require("../../config.js");

const reports = require("../database/reports.js");
const posts = require("../database/posts.js");
const files = require("../database/files.js");
const comments = require("../database/comments.js");


//Multer init for files upload
const storage = multer.diskStorage({
    destination: `${__dirname}/../uploads`,
    filename: function(req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, callback) {
        const extname = config.multer_allowed_files.test(file.originalname.toLowerCase());
        const mimetype = config.multer_allowed_files.test(file.mimetype);
        if(extname && mimetype) callback(null, true);
        else{
            callback("Erreur: le ficher doit faire 1mb MAX et être une image ou une vidéo");
        }
    }
}).array("files[]", 8);

router.get("/post/:id", loginRequired, async(req, res) => {
    if(!isNaN(req.params.id)) {
        const {error, data} = await posts.getById(req.params.id);

        if(!error) {
            res.json(data[0]);

        } else {
            if(error === "no result") res.writeHead(404);
            else rs.status(500);
            res.end();
        }
    }
});

router.get("/post/:post_id/files", loginRequired, async(req, res) => {
    const {data, error} = await posts.getFiles(req.params.post_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.get("/posts", loginRequired, async(req, res) => {
    const {error, data} = await posts.search(req.query);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.post("/upload", loginRequired, async(req, res) => {
	upload(req, res, async(err) => {
        let failed = false;
        const {title, content, category} = req.body;
        const errors = utils.validateForm({ title, content }, {
            title: {min: 1, max:255},
            content: {min:1, max:2000}
        });
        
        if(errors || err) failed = true;
        if(!failed) {
            const post_add = await posts.add(title, content, req.user.user_id, category);
            const files_add = await files.add(req.files, post_add.last_id);

            if(!post_add.error && !files_add.error) {
                res.json(["article ajouté!"]);
                return;
            }
        }
        res.status(500);
        res.end();
    })
});

router.post("/post/:post_id/report", loginRequired, async(req, res) => {
    const {error, data} = await reports.report({
        user: req.user.user_id,
        post: req.params.post_id,
        reason: req.body.content
    });

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.delete("/post/:post_id", loginRequired, async(req, res) => {

    const {error, data} = await posts.getById(req.params.post_id);

    if(data[0].post_user === req.user.user_id) {
        const {error, data} = await posts.remove(req.params.post_id);

        if(!error) {
            res.json(data);
            return;
        }
    } 
    res.status(500);
    res.end();
});

router.post("/post/:post_id/comments", loginRequired, async(req, res) => {
    const {error, data} = await comments.add(req.params.post_id, req.user.user_id, req.body.content);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.get("/post/:post_id/comments", loginRequired, async(req, res) => {
    const {error, data} = await posts.getComments(req.params.post_id, req.query.start, req.query.step);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.delete("/post/:post_id/comment/:comment_id", loginRequired, async(req, res) => {
    const {error, data} = await comments.remove(req.params.comment_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

module.exports = router;