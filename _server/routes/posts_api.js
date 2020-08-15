"use strict";

const express = require("express");
const multer = require("multer");
const router = express.Router();

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
        let extension = file.originalname.split(".");
        extension = extension[extension.length - 1];
        callback(null, `${Date.now()}-${utils.generateToken(8)}.${extension}`);
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

//GET
router.get("/post/:id", async(req, res) => {
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

router.get("/post/:post_id/files", async(req, res) => {
    const {data, error} = await posts.getFiles(req.params.post_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.get("/posts", async(req, res) => {
    const {error, data} = await posts.search(req.query);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.get("/post/:post_id/comments", async(req, res) => {
    const {error, data} = await posts.getComments(req.params.post_id, req.query.start, req.query.step);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.get("/post/:post_id/votes", async(req, res) => {
    const {error, data} = await posts.getVotes(req.params.post_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
})

//POST
router.post("/upload", async(req, res) => {
	upload(req, res, async(err) => {
        let failed = false;
        const {title, content, category} = req.body;
        const errors = utils.validateForm({ title, content }, {
            title: {min: 1, max: 57},
            content: {min:1, max:2500}
        });

        if(errors || err) failed = true;
        
        if(!failed) {
            const post_add = await posts.add(title, content, req.user.user_id, category);
            const files_add = await files.add(req.files, post_add.last_id);
    
            if(!post_add.error && !files_add.error) {
                res.json(post_add.data.insertId);
                return;
            }
        }
        res.status(500);
        res.end();
    })
});

router.post("/post/:post_id/report", async(req, res) => {
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

router.post("/post/:post_id/comments", async(req, res) => {
    const {error, data} = await comments.add(req.params.post_id, req.user.user_id, req.body.content);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.post("/post/:post_id/views", async(req, res) => {
    posts.addViews(req.params.post_id);
});

//DELETE
router.delete("/post/:post_id", async(req, res) => {

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

router.delete("/post/:post_id/comment/:comment_id", async(req, res) => {
    const {error, data} = await comments.remove(req.params.comment_id, req.user.user_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

//PATCH
router.patch("/post/:post_id", async(req, res) => {
    const {error, data} = await posts.getById(req.params.post_id);

    if(data[0].post_user === req.user.user_id && !error) {
        const {title, content, category} = req.body;
        const {error, data} = await posts.edit(title, content, category, req.params.post_id);

        if(!error) {
            res.json(data);
            return;
        }
    } 
    res.status(500);
    res.end();
});

router.patch("/post/:post_id/comment/:comment_id", async(req, res) => {

    const {content} = req.body;

    const {error, data} = await comments.edit(req.params.comment_id, req.user.user_id, content);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

//PUT
router.put("/post/:post_id/votes", async(req, res) => {
    let {value} = req.body;
    let db_call = false;

    if(value !== 0){
        if(value === -1) value = 0;
        db_call = await posts.addVote(req.user.user_id, req.params.post_id, value);
    } else {
        db_call = await posts.cancelVote(req.user.user_id, req.params.post_id);
    }


    if(!db_call.error) {
        res.json(db_call.data);
    } else {
        res.status(500);
        res.end();
    }
});

module.exports = router;