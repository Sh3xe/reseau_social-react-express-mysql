"use strict";

// Modules
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Inits
const config = require("./config.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Routes
app.set("view engine", "ejs");

app.use("/api", require("./routes/api.js") );

app.get("*", (req, res) => {
    res.sendFile( __dirname + "/client/build/index.html" );
});

// middlewares
app.use(express.static( __dirname + "/client/build" ));
app.use(express.json());

//Start
server.listen(config.port, () =>{
    console.log(`Listening on port ${config.port}`);
});