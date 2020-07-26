"use strict";

const express = require("express");
const fs = require("fs");
const router = express.Router();

const {validateForm} = require("../utils.js");
const users = require("../database/users.js");

router.post("/register", async(req, res) => {
	//get and validate the form
	const {name, email, password, key} = req.body;

	const errors = validateForm({
		name,
		email,
		password
	}, {
		name: {min: 3, max: 100},
		email: {max: 255},
		password: {min: 8, max: 100},
	});

	if(errors) {
		res.status(400);
		res.json({errors: ["Mauvais formulaire."]});
		return;
	}

	//verify the key
	const keys = JSON.parse(fs.readFileSync( __dirname + "/../registration_keys.json" ));

	// If the length of the array containing only this key is 0, we end
	if(!(keys.filter(e => e === key)).length) {
		res.status(400);
		res.json({errors:["Mauvaise clef"]});
		return;
	}

	// else we add the user
	const {error} = await users.add(name, email, password);

	if(error) {
		res.status(500);
		res.json({errors:["Impossible d'ajouter un utilisateur"]});
	} else {
		res.status(200);
		res.end();
	}
});

router.post("/login", async(req, res) => {
	console.log(req.body)
	//get and validate form
	const {email, password} = req.body;

	const errors = validateForm({
		email,
		password
	}, {
		email: {max:255},
		password: {min:8, max: 100}
	});

	if(errors.length) {
		res.status(400);
		res.json({errors});
		return;
	}
	
	//authenticate
	const {data, error} = await users.authenticate(email, password);
	
	if(error) {
		res.status(400);
		res.json({errors: ["Mauvaise e-mail ou mot de passe"]});
		return;
	}
	
	//Update user token and put inside session
	await users.updateToken(data.user_id);

	const updated_user =  await users.getById(data.user_id);

	req.session.user = updated_user.data;
	req.session.user_token = req.session.user.user_token;

	res.json(updated_user.data);
});

router.get("/logout", (req, res) => {
	res.clearCookie("session");
	res.redirect("login");
});

module.exports = router;