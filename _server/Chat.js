"use strict";

const chatrooms = require("./database/chatrooms.js");
const users = require("./database/users.js");

const {validateForm} = require("./utils.js");

// Due to its use of javascript objects,
// this app is not really scalable in terms
// of the users it can handle


// TODO Add a "sendToRoom" function

class ChatApp {
    constructor(io) {
        // Vars
        this.io = io;
        this.sockets = [];

        // Socket logic
        io.on("connection", (socket) => {
            // Authenticate the socket
            socket.on("new-user", async({user_token, room_id}) => {
                // (returns a error and data object)
                const user = await users.getByToken(user_token);

                if(user.error) {
                    socket.emit("error", "Impossible de vous endentifier");
                    return;
                }

                const is_allowed = await chatrooms.isUserAllowed(user.data.user_id, room_id);
                
                if(!is_allowed) {
                    socket.emit("chat_error", "Vous n'êtes pas autorisé à accéder à ce salon.");
                    return;
                }

                // If the user is authenticated and allowed, we give him the room data
                // and we add him to the sockets list

                socket.user = user.data;
                socket.room = room_id;

                this.sockets.push(socket);
                
                // (returns a error and data object)
                const last_messages = await chatrooms.getMessages(room_id, {start: 0, step: 30});

                // Emit the last 30 messages to the client
                socket.emit("last-messages", last_messages.data);

                // Updating the user list for everyone
                this.updateUserList(room_id);
            });

            socket.on("disconnect", () => {
                this.removeSocket(socket);
            });

            socket.on("chat-exit", () => {
                this.removeSocket(socket);
            });

            socket.on("message", async(msg) => {
                if(socket.user !== undefined) {

                    // Validate the form, send the messages to the sockets,
                    // add the message to the database
                    const errors = validateForm({
                        message: msg
                    }, {
                        message: {min: 1, max: 250, type: "string"}
                    })

                    if(!errors.length) {
                        this.sendMessage(socket, msg);
                        await chatrooms.sendMessage(socket.user.user_id, socket.room, msg);
                    }
                }
            });
        });
    }

    removeSocket(socket) { //OK
        if(socket.user !== undefined) {
            this.sockets = this.sockets.filter(s => {
                s.user.user_token !== socket.user.user_token;
            });
        }
    }

    sendMessage(socket, msg) { //OK
        for(let i = 0; i < this.sockets.length; i++) {
            // we emit a message for every users
            // if the user is in the same room and is not the sender.
            if(this.sockets[i].room === socket.room) {
                this.sockets[i].emit("message", {
                    content: msg,
                    user: socket.user,
                    date: new Date()
                });
            }
        }
    }

    updateUserList(room_id) { //OK
        let users = [];

        for(let i = 0; i < this.sockets.length; i++) {
            if(this.sockets[i].room === room_id) {
                users.push(this.sockets[i].user);
            }
        }


        for(let i = 0; i < this.sockets.length; i++) {
            if(this.sockets[i].room === room_id) {
                this.sockets[i].emit("user-list", users)
            }
        }
    }
}

module.exports = ChatApp;