var express = require('express');
var app     = express();

var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
io.set('log level', 1);

//app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


app.get('/test', function(req, res){
    res.send('Server is ok !');
});

app.get('/', function(req, res){
    res.render('home.jade');
});


io.sockets.on('connection', function(socket) {
    
    io.sockets.emit('welcome', 'hello');
    
    socket.on('coords', function(data){
       io.sockets.emit('coords', data);
	});
    
});

server.listen(8075);


