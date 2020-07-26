"use strict";

const express = require("express");
const multer = require("multer");
const router = express.Router();

const loginRequired = require("./loginRequired.js");

const posts = require("../database/posts.js");

//Multer init for files upload
/*
const storage = multer.diskStorage({
    destination: `${__dirname}/../uploads`,
    filename: function(req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname.length}`);
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, callback) {
        const extname = config.multer_allowed_files.test(file.originalname.toLocaleLowerCase());
        const mimetype = config.multer_allowed_files.test(file.mimetype);
        if(extname && mimetype) callback(null, true);
        else{
            callback("Erreur: le ficher doit faire 1mb MAX et être une image ou une vidéo");
        }
    }
}).single("Image");
*/

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

router.get("/posts", async(req, res) => {
    const {error, data} = await posts.search(req.query);

    if(!error) {
        res.json(data);
    } else {
        res.status(500);
        res.end();
    }
});

router.post("/upload", loginRequired, async(req, res) => {
	//multer stuff
});

module.exports = router;