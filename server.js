var express = require('express');
var app     = express();

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

io.sockets.on('connection', function(socket) {
    io.sockets.emit('welcome', 'hello');
    
    socket.on("ask gamesInfos", function() {
        var path  = "./public/scripts/games";
        var games = fs.readdirSync(path);
        var names = [];
        var descriptions = [];

        for (var i = 0; i < games.length; i++) 
        {
            var file = fs.readFileSync(path+"/"+games[i], "utf8");

            var nameStart  = file.search("@name") + 6;
            var nameLength = file.search("@endName") - nameStart;
            var nameText   = file.substr(nameStart, nameLength);
            if (nameText === "") {
                nameText = games[i].substr(0, games[i].length-3).replace(/_/g, " ");
            }
            names.push(trim(nameText));

            var descriptionStart  = file.search("@description") + 12;
            var descriptionLength = file.search("@endDescription") - descriptionStart;
            var descriptionText   = file.substr(descriptionStart, descriptionLength);
            descriptions.push(trim(descriptionText));
        }

        socket.emit('send gamesInfos', { names : names, descriptions : descriptions });    
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