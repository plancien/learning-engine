var fs = require('fs');
var rootPath = require('path').join(__dirname, '../');

module.exports = function(io) {

    function getFileInfos(path) {
        var games = fs.readdirSync(path);
        var gameNames = [];
        var fileNames = [];
        var descriptions = [];
        var templates = [];

        for (var i = 0; i < games.length; i++) {
            var file = fs.readFileSync(path + "/" + games[i], "utf8");

            var nameStart = file.search("@name") + 5;
            var nameLength = file.search("@endName") - nameStart;
            var nameText = file.substr(nameStart, nameLength);
            var fileName = games[i].substr(0, games[i].length - 3);
            if (nameText === "") {
                nameText = fileName;
            }
            gameNames.push(nameText.trim());
            fileNames.push(fileName);

            var descriptionStart = file.search("@description") + 12;
            var descriptionLength = file.search("@endDescription") - descriptionStart;
            var descriptionText = file.substr(descriptionStart, descriptionLength);
            descriptions.push(descriptionText.trim());
        }

        return {
            names: gameNames,
            fileNames: fileNames,
            descriptions: descriptions,
            templates: templates
        };
    }

    var idtest = 0;
    var id = 0;

    io.sockets.on('connection', function(socket) {
        var user = []; // Tab for one specific user, destinate to a client side update
        var allUsers = []; // Sever side tab with all the users
        socket.set('id', id);
        io.sockets.emit('welcome', 'hello');

        // WIP hope to link the score to users tab
        socket.on('nouveau_client', function(pseudo) {
            id++;
            user.push(id);
            user.push(pseudo);
            allUsers.push(user); /* I tought it was forgotten */
            // socket.set('id', id); 
            socket.set('users', allUsers);
            socket.broadcast.emit('nouveau_client');
        });

        socket.on('StoreXY', function(X, Y, player) {
            idtest++;
            if (idtest > id) {
                idtest = 1;
            }
            socket.emit('Update player', X, Y, idtest, player);
            socket.broadcast.emit('Update player', X, Y, idtest, player);
        });

        socket.on('tir', function(ArrayShoot) {
            socket.emit('afficheTir', ArrayShoot);
            socket.broadcast.emit('afficheTir', ArrayShoot);
        });

        socket.on('infodeCollision', function(ArrayShoot, player) {
            socket.broadcast.emit('testCollision', ArrayShoot, player);
        });

        socket.on('collision', function(IdPlayer, IdShoot, nbrShoot) {
            socket.emit('collision complete', IdPlayer, IdShoot, nbrShoot);
            socket.broadcast.emit('collision complete', IdPlayer, IdShoot, nbrShoot);
        });

        socket.on('MyID', function() {
            socket.get('id', function(error, id) {
                socket.emit('create', id);
            });
        });

        socket.on("ask images names", function() {
            var names = fs.readdirSync("./public/images");
            socket.emit('send images names', names);
        });

        socket.on("ask gamesInfos", function() {
            var games = getFileInfos(rootPath + "./public/scripts/games");
            var models = getFileInfos(rootPath + "./public/scripts/game_types");
            socket.emit('send gamesInfos', {
                games: games,
                models: models
            });
        });

        socket.on("ask css", function(data) {
            var path = "css/" + data + ".css";
            if (fs.existsSync("./public/" + path)) {
                socket.emit("inject css", path);
            }
        });

        socket.on("ask template", function(data) {
            var path = rootPath + "./public/templates/" + data + ".html";
            var template = "";
            if (fs.existsSync(path)) {
                template = fs.readFileSync(path, "utf8");
            }
            socket.emit("inject template", template);
        });

        socket.on('coords', function(data) {
            io.sockets.emit('coords', data);
        });

    });

};
