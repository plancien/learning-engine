
var fs = require('fs');
// var img = require("../server/img.js");

var gforce = require(__dirname + "/../server/gforce");
var systeme = require(__path.controller + "/socket");

module.exports = function(io) {
    io.sockets.on('connection', function(socket) {
        gforce.register(socket);
        systeme.register(socket);
    });
};
