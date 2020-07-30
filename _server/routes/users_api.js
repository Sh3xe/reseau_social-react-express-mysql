"use strict";

const express = require("express");
const router = express.Router();

const users = require("../database/users.js");
const relations = require("../database/relations.js");

//GET
router.get("/users", async(req, res) => {
    // search for users
    console.log(req.query)
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
        res.json(data);
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
        res.json(data);
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