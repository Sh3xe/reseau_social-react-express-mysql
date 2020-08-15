"use strict";

const chatrooms = require("./database/chatrooms.js");
const users = require("./database/users.js");
const relations = require("./database/relations.js");

const {validateForm} = require("./utils.js");

//TODO verify the private messages

class ChatApp {
    constructor(io) {
        // Vars
        this.io = io;
        this.sockets = [];

        // Socket logic
        io.on("connection", (socket) => {
            // Authenticate the socket
            socket.on("new-user", async({user_token, room_id, user_to}) => {

                // (returns a error and data object)
                const user = await users.getByToken(user_token);

                if(user.error) {
                    socket.emit("error", "Impossible de vous endentifier");
                    return;
                }

                // If the user connects to a chatroom
                if(room_id !== undefined) {

                    const is_allowed = await chatrooms.isUserAllowed(user.data.user_id, room_id);
                    
                    if(!is_allowed) {
                        socket.emit("chat_error", "Vous n'êtes pas autorisé à accéder à ce salon.");
                        return;
                    }

                    // If the user is authenticated and allowed, we give him the room data
                    // and we add him to the sockets list
                    socket.user = user.data;
                    socket.room = room_id;
                    socket.join_time = new Date();

                    this.sockets.push(socket);
                    
                    // (returns a error and data object)
                    const last_messages = await chatrooms.getMessages(room_id, {start: 0, step: 30});

                    // Emit the last 30 messages to the client
                    if(!last_messages.error) {
                        const formated_last_messages = this.dbToChatroomMessages(last_messages.data);
                        socket.emit("last-messages", formated_last_messages);
                    }

                    // Updating the user list for everyone
                    this.updateUserList(room_id);
                }
                // If the user connect to a private conversation 
                else if(user_to !== undefined) {
                    const relation = await relations.relationExists(user_to, user.data.user_id);

                    if(relation === false || (relation && relation.relation_status !== "friends")) {
                        socket.emit("chat-error", "Vous n'êtes pas amis avec cette utilisateur");
                        return;
                    }

                    // Adds the user to the socket list with different data
                    socket.user = user.data;
                    socket.user_to = Number(user_to);

                    this.sockets.push(socket);

                    // Send the last 30 messages
                    const last_messages = await chatrooms.getPrivateMessages(socket.user_to, socket.user.user_id, {start: 0, step: 30});

                    if(!last_messages.error) {
                        const formated_last_messages = this.dbToPrivateMessages(last_messages.data);
                        socket.emit("last-messages", formated_last_messages);
                    }
                }
            });

            socket.on("disconnect", () => {
                if(socket.room !== undefined)
                    this.updateUserList(socket.room);

                this.removeSocket(socket);
                
            });

            socket.on("chat-exit", () => {
                if(socket.room !== undefined)
                    this.updateUserList(socket.room);

                this.removeSocket(socket);
            });

            socket.on("message", async(msg) => {
                if(socket.user === undefined) return;

                // Validate the form, send the messages to the sockets,
                // add the message to the database
                const errors = validateForm({
                    message: msg
                }, {
                    message: {min: 1, max: 250, type: "string"}
                })

                if(!errors.length) {
                    // If the socket has a "user_to" then we send a PM
                    if(socket.user_to !== undefined) {
                        this.sendPrivateMessage(socket, msg);
                        await chatrooms.sendPrivateMessage(socket.user.user_id, socket.user_to, msg);
                    }
                    // else we send a message to the room
                    if(socket.room !== undefined) {
                        this.sendMessage(socket, msg);
                        await chatrooms.sendMessage(socket.user.user_id, socket.room, msg);
                    }
                }
            });
        });
    }

    removeSocket(socket) {
        if(socket.user !== undefined) {
            this.sockets = this.sockets.filter(s => {
                return (s.user.user_token !== socket.user.user_token && s.join_time !== socket.join_time);
            });
        }
    }
    
    updateUserList(room_id) {
        let users = [];

        for(let i = 0; i < this.sockets.length; i++) {
            if(this.sockets[i].room === room_id) {
                users.push({
                    ...this.sockets[i].user,
                    join_time: this.sockets[i].join_time
                });
            }
        }
        
        this.sendToRoom(room_id, "user-list", users);
    }
    
    sendMessage(socket, msg) {
        this.sendToRoom(socket.room, "message", {
            content: msg,
            user: socket.user,
            date: new Date()
        });
    }

    sendPrivateMessage(socket, msg) {
        const message = {
            content: msg,
            user: socket.user,
            date: new Date()
        };

        this.sendToUser(socket.user_to, "message", message);

        console.log("message sent")
        socket.emit("message", message);
    }

    // Utils functions to emit event to a specific room or user
    sendToUser(user_id, event_name, data) {
        for(let i = 0; i < this.sockets.length; i++) {
            if(this.sockets[i].user.user_id === user_id) {
                this.sockets[i].emit(event_name, data);
            }
        }
    }

    sendToRoom(room_id, event_name, data) {
        for(let i = 0; i < this.sockets.length; i++) {
            if(this.sockets[i].room === room_id) {
                this.sockets[i].emit(event_name, data);
            }
        }
    }

    // Utils functions to format database's data to the format
    // used by the client app
    dbToChatroomMessages(message_list) {
        let messages = [];

        for(let i = 0; i < message_list.length; i++) {
            messages.push({
                content: message_list[i].message_content,
                user: {
                    user_id: message_list[i].user_id,
                    user_avatar: message_list[i].user_avatar,
                    user_name: message_list[i].user_name
                },
                date: message_list[i].message_date
            });
        }

        return messages;
    }

    dbToPrivateMessages(message_list) {
        let messages = [];

        for(let i = 0; i < message_list.length; i++) {
            messages.push({
                content: message_list[i].mp_content,
                user: {
                    user_id: message_list[i].mp_from,
                    user_avatar: message_list[i].user_avatar,
                    user_name: message_list[i].user_name
                },
                date: message_list[i].mp_date
            });
        }
        
        return messages;
    }
}

module.exports = ChatApp;