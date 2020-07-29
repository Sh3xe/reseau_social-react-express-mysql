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
    sameSite: "Strict",
    secret: config.secret_key,
    duration: 30 * 60 * 1000,
    ephemeral: true
}));

// middlewares
const custom_middlewares = require("./middlewares.js");

app.use(custom_middlewares.logRequests);

app.use(express.static(path.join( __dirname, "/client/build" )));
app.use(express.static(path.join( __dirname, "/uploads" )));
app.use(express.json());
app.use(custom_middlewares.authenticateUser);

// Routes
const loginRequired = require("./routes/loginRequired.js")

//Login not required
app.use("/api", require("./routes/authentication_api.js") );
//Login required
app.use("/api", loginRequired);
app.use("/api", require("./routes/posts_api.js") );
app.use("/api", require("./routes/users_api.js") );

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