
global.__path = require(__dirname + "/path.js");

var express = require('express');
var http = require('http');
var registerRoutes = require(__path.controller+'/routes');
var initConnection = require('./init_connection');

module.exports = function(app) {
     __path.initViews(app);

    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'klyiltdtomerqtsdylyz'
    }));
    app.use(express.static(__path.root + '/public'));
    app.use(express.bodyParser());
    var server = http.createServer(app);
    server.listen(8075);

    var io = require('socket.io').listen(server);
    io.set('log level', 1);

    initConnection(io);
    registerRoutes(app);
};

