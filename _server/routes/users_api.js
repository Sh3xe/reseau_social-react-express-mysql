"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

const users = require("../database/users.js");
const relations = require("../database/relations.js");
const utils = require("../utils.js");

//Multer init for files upload
const storage = multer.diskStorage({
    destination: `${__dirname}/../uploads`,
    filename: function(req, file, callback) {
        let extension = file.originalname.split(".");
        extension = extension[extension.length - 1];
        callback(null, `useravatar-${Date.now()}-${utils.generateToken(8)}.${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, callback) {
        const extname = /png|jpg|jpeg|gif/.test(file.originalname.toLowerCase());
        const mimetype = /png|jpg|jpeg|gif/.test(file.mimetype);
        if(extname && mimetype) callback(null, true);
        else {
            callback("Erreur: le ficher doit faire 1mb MAX et être une image ou une vidéo");
        }
    }
}).single("avatar");

//GET
router.get("/users", async(req, res) => {
    // search for users
    const search_params = {
        search_query: req.query.search,
        start: req.query.start,
        step: req.query.step
    }

    const {error, data} = await users.search(search_params);

    if(!error) {
        res.json(data);
    } else {
        res.status(400);
        res.end();
    }
});

router.get("/current_user", async(req, res) => {
    // Returns the information of the user who sent the request
    const {data, error} = await users.getByToken(req.session.user_token);

    if(!error) {
        const colors = utils.parseKeyValueString(data.user_colors);
        
        res.json({
            ...data,
            ...colors
        });
    } else {
        res.status(400);
        res.end();
    }
});

router.get("/user/:user_id/posts", async(req, res) => {

    // Gets the posts of a user

    const {start, step} = req.query;

    const {data, error} = await users.getPosts(req.params.user_id, start, step);

    if(!error) {
        res.json(data);
    } else {
        res.status(400);
        res.end();
    }
});

router.get("/user/:id", async(req, res) => {
    //Get a user by its Id
    const {data, error} = await users.getById(req.params.id);

    if(!error) {
        const colors = utils.parseKeyValueString(data.user_colors);

        res.json({
            ...data,
            ...colors
        });
    } else {
        res.status(400);
        res.end();
    }
});

router.get("/user/:user_id/relation", async(req, res)=> {
    // get the relation between the user_id and the
    // user who sent the http request
    if(req.params.user_id != req.user.user_id) {
        const relation = await relations.relationExists(req.params.user_id, req.user.user_id);
        res.json(relation);
        return;
    }
    res.status(418);
    res.end();
});

router.get("/user/:user_id/friends", async(req, res)=> {
    // get the friends of the user_id
    const {data, error} = await users.getFriends(req.params.user_id);

    if(!error) {
        res.json(data);
    } else {
        res.status(400);
        res.end();
    }
});

router.get("/user/:user_id/requests", async(req, res) => {
    if(req.params.user_id == req.user.user_id) {
        const {error, data} = await users.getRequests(req.user.user_id);

        if(!error) {
            res.json(data);
            res.end();
            return;
        } else {
            console.log(error)
            res.status(500);
            res.end();
            return;
        }
    }
    res.status(403);
    res.end();
});

//POST
router.post("/user/:user_id/friends", async(req, res)=> {
    // The user who sent the http request send a friend request
    // to user_id

    if(isNaN(req.params.user_id)) {
        res.status(400);
        res.end();
        return;
    }

    if(req.params.user_id !== req.user.user_id) {
        const {data, error} = await relations.sendRequest(req.user.user_id, req.params.user_id);

        if(!error) {
            res.json(data);
        } else {
            res.status(400);
            res.end();
        }
        return;
    }
    res.status(403);
    res.end();
});

//PUT
router.put("/user/:user_id/friends", async(req, res)=> {
    // The user who sent the http request will accept
    // the friend request of user_id

    if(isNaN(req.params.user_id)) {
        res.status(400);
        res.end();
        return;
    }

    if(req.params.user_id == req.user.user_id) {
        const {data, error} = await relations.acceptRequest(req.user.user_id, req.body.user_id);

        if(!error) {
            res.json(data);
        } else {
            console.log(error)
            res.status(400);
            res.end();
        }
        return;
    }
    res.status(403);
    res.end();
});

router.put("/dashboard/avatar", async(req, res) => {
    upload(req, res, async(err) => {
        if(!err) {
            const {error} = await users.update(req.user.user_id, {
                avatar: req.file.filename
            });

            if(!error) {
                fs.unlinkSync(`${__dirname}/../uploads/${req.user.user_avatar}`);
                res.end();
                return;
            } else {
                res.status(500);
                res.end();
            }
        }

        res.status(400);
        res.end();
    });
});

//PATCH
router.patch("/dashboard", async(req, res) => {
    //get and validate form
    const {username, bio} = req.body;

    let colors = undefined;
    if(req.body.colors) {
        const {col1, grd1, grd2} = req.body.colors;
        if(col1 && grd1 && grd2)
            colors = {col1, grd1, grd2};
    }

	const errors = utils.validateForm({
		username,
		bio
	}, {
		username: {max:100},
		bio: {max: 1317}
	}, true);

	if(errors.length) {
        res.status(400);
		res.json({errors});
		return;
    }
    
    //Modification utilisateur
    const {error} = await users.update(req.user.user_id, {name: username, bio, colors});
    
    if(!error) {
        res.status(200);
        res.end();
        return;
    }

    res.status(500);
    res.end();
});

//DELETE
router.delete("/user/:user_id/friends", async(req, res)=> {

    // The user who sent the http request will remove
    // user_id from its friends

    if(isNaN(req.params.user_id)) {
        res.status(400);
        res.end();
        return;
    }

    if(req.params.user_id == req.user.user_id) {
        const {data, error} = await relations.remove(req.user.user_id, req.body.user_id);

        if(!error) {
            res.json(data);
        } else {
            res.status(400);
            res.end();
        }
        return;
    }
    res.status(403);
    res.end();
});

module.exports = router;