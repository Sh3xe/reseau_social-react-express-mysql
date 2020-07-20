"use strict";

// Modules
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

// Inits
const config = require("./config.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Routes

app.use("/api", require("./routes/api.js") );

app.get("/", (req, res) => {
    res.sendFile( path.join(__dirname, "/client/build/index.html") );
});

// middlewares
app.use(express.static( path.join(__dirname, "/client/build" )));
app.use( require("./middlewares/logMiddleware.js") );
app.use(express.json());

//Start
server.listen(config.port, () =>{
    console.log("Server started");
});