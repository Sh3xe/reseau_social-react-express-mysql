"use strict";

// Modules
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const sessions = require("client-sessions");

// Inits
const config = require("../config.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(sessions({ // cookie init
    cookieName: "session",
    sameSite: "strict",
    secret: config.secret_key,
    duration: 10 * 60 * 1000,
    ephemeral: true
}));

// middlewares
const custom_middlewares = require("./middlewares.js");

app.use(express.static(path.join( __dirname, "/client/build" )));
app.use(custom_middlewares.logRequests);
app.use(express.json());
//app.use(custom_middlewares.authenticate);

// Routes
app.use("/api", require("./routes/posts.js") );
app.use("/api", require("./routes/authentication.js") );

// React App
app.use((req, res, next) => {
    // This middleware is executed when no routes fit
    // (We just send the react app)
    res.sendFile( path.join(__dirname, "/client/build/index.html") );
});

//Start
server.listen(config.port, () =>{
    console.log("Server started");
});