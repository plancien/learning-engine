var express = require('express');
var http = require('http');
var rootPath = require('path').join(__dirname, '../');

var registerRoutes = require('./routes');
var registerSockets = require('./sockets');

module.exports = function(app) {

    // HTTP & ExpressJS Setup
    // app.use(express.logger());
    app.use(express.static(rootPath + '/public'));
    app.set('views', rootPath + '/views');
    var server = http.createServer(app);
    server.listen(8075);

    // Socket.io
    var io = require('socket.io').listen(server);
    io.set('log level', 1);

    registerSockets(io);
    registerRoutes(app);

};
