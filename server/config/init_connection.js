
var fs = require('fs');

var gforce = require(__dirname + "/../gforce");
var systeme = require(__path.controller + "/socket");

module.exports = function(io) {
    io.sockets.on('connection', function(socket) {
        gforce.register(socket);
        systeme.register(socket);
    });
};
