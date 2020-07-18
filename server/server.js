const http = require("http");
const express = require("express");

const config = require("./config.js");
const app = express();

const server = http.createServer(app);

server.listen(config.port, () =>{
    console.log(`Listening on port ${config.port}`);
});