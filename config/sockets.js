var fs = require('fs');
var moduleBroadcast = require('./global_broadcast');
var rootPath = require('path').join(__dirname, '../');
var img = require("../server/img.js");
var gforce = require(__dirname+"/../server/gforce")
var systeme = require(__dirname+"/../server/main_socket")
var sessions = require(__dirname+"/../server/sessions")

module.exports = function(io) {
    var idtest = 0;
    var id = 0;
    var users = {};
    var amountOfConnections = 0;

    io.sockets.on('connection', function(socket) {
        
        socket.on("name", function(name){socket.name=name;socket.emit("autentificated")});

        amountOfConnections++;

        moduleBroadcast(io,socket);
        
        gforce.register(socket);
        systeme.register(socket);

        socket.on("disconnect", function() {
            socket.broadcast.emit('player disconnected', {id:socket.id});
        })

        sessions.register(socket,io)
    });

};
