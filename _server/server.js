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

app.use(sessions({ // cookie init
    cookieName: "session",
    secret: config.secret_key,
    duration: 30 * 60 * 1000,
    cookie: {
        ephemeral: true,
        sameSite: "Strict"
    }
}));

//socketio chats
const io = socketio(server);
const ChatApp = require("./Chat.js");

new ChatApp(io);

// middlewares
const custom_middlewares = require("./middlewares.js");

app.use(custom_middlewares.logRequests);
app.use(express.static(path.join( __dirname, "../_client/build" )));
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
app.use("/api", require("./routes/chat_api.js") );
app.use("/api", require("./routes/users_api.js") );

// React App
app.use((req, res, next) => {
    // This middleware is executed when no routes fit
    // (We just send the react app)
    res.sendFile( path.join(__dirname, "../_client/build/index.html") );
});

//Start
server.listen(config.port, () =>{
    console.log("Server started");
});