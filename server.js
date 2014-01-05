var express = require('express');
var app     = express();

var id = 0;

var fs      = require('fs');

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

function trim(myString)
{
    return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
}

function getFileInfos(path)
{
    var games = fs.readdirSync(path);
    var gameNames    = [];
    var fileNames    = [];
    var descriptions = [];

    for (var i = 0; i < games.length; i++) 
    {
        var file = fs.readFileSync(path+"/"+games[i], "utf8");

        var nameStart  = file.search("@name") + 5;
        var nameLength = file.search("@endName") - nameStart;
        var nameText   = file.substr(nameStart, nameLength);
        var fileName = games[i].substr(0, games[i].length-3);
        if (nameText === "") {
            nameText = fileName;
        }
        gameNames.push(trim(nameText));
        fileNames.push(fileName);

        var descriptionStart  = file.search("@description") + 12;
        var descriptionLength = file.search("@endDescription") - descriptionStart;
        var descriptionText   = file.substr(descriptionStart, descriptionLength);
        descriptions.push(trim(descriptionText));
    }

    return { names : gameNames, fileNames : fileNames, descriptions : descriptions };
}

io.sockets.on('connection', function(socket) {
    
    socket.set('id', id);

    io.sockets.emit('welcome', 'hello');

    socket.on('nouveau_client', function(pseudo) {
    id++;
    socket.set('id', id);

       // eventBus.emit('new player', 5, 5, 300, 100,canvas);
        socket.broadcast.emit('nouveau_client');
    });

    socket.on('StoreXY', function (X, Y) {
        
        socket.emit('Update player', X, Y);
        socket.broadcast.emit('Update player', X, Y);


    });


    socket.on('MyID', function () {
        socket.get('id', function (error, id) {
            socket.emit('create',id);
        });
    }); 


    socket.on("ask gamesInfos", function() {        
        var games  = getFileInfos("./public/scripts/games");
        var models = getFileInfos("./public/scripts/game_models");
        socket.emit('send gamesInfos', { games : games, models : models });    
    });

    socket.on("ask images names", function() {
        var names = fs.readdirSync("./public/images");
        socket.emit('send images names', names)
    });

    socket.on("ask css", function(data) {
        var path = "css/" + data + ".css"
        if(fs.existsSync("./public/"+path)) {
            socket.emit("inject css", path);
        }
    });

    socket.on('coords', function(data){
       io.sockets.emit('coords', data);
    });
    
});

server.listen(8075);