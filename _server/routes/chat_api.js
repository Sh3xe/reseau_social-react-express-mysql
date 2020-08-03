const express = require("express");
const router = express.Router();

const chatrooms = require("../database/chatrooms.js");
const {validateForm} = require("../utils.js");

//GET
router.get("/chatrooms", async(req, res) => {
    //get the query params
    const {search, start, step} = req.query;
    //convert "is_private" to boolean
    const is_private = req.query.type === "private";

    //Call the database function
    const search_params = {search, start, step};
    const {error, data} = await chatrooms.search(is_private, req.user.user_id, search_params);

    console.log(is_private, req.user.user_id, search_params)

    if(error) {
        res.status(400);
        res.end();
        return;
    }

    res.json(data);
});

router.get("/chatroom/:chat_id", async(req, res) => {
    const {error, data} = await chatrooms.get(req.params.chat_id);

    if(error) {
        res.status(400);
        res.end();
        return;
    }

    res.json(data[0]);
});

//POST
router.post("/chatrooms", async(req, res) => {
    //Get and validtate the request's form
    const {name, is_private} = req.body;

    const validation_errors = validateForm(
        {name, is_private}, {
        name: {min:4, max:100, type: "string"},
        is_private: {type: "boolean"}
    });

    if(validation_errors) {
        res.status(400);
        res.json(validation_errors);
        return;
    }

    //Call the database function
    const {error, data} = await chatrooms.add({
        name, is_private,
        user_id: req.user.user_id
    });

    if(error) {
        res.status(500);
        res.end();
        return;
    }

    res.json(data.insertId);
});

//DELETE
router.delete("/chatroom/:chatroom_id", async(req, res) => {
    const {chatroom_id} = req.params;
    const {error, data} = await chatrooms.remove(chatroom_id, req.user.user_id);

    if(error || !data.affectedRows) {
        res.status(400);
        res.end();
        return;
    }

    res.end();
});

//PATCH
router.patch("/chatroom/:chatroom_id", async(req, res) => {
    //Get and validate the req.body;
    const {name, type} = req.body;
    const {chatroom_id} = req.params;

    const validation_errors = validateForm(
        {name}, {
        name: {min:4, max:100, type: "string"}
    }, true);

    if(validation_errors) {
        res.status(400);
        res.json(validation_errors);
        return;
    }

    //Call the database function
    const {error} = await chatrooms.update(chatroom_id, req.user.user_id, {name, type});

    if(error) {
        res.status(500);
        res.end();
        return;
    }

    res.end();
});

module.exports = router;