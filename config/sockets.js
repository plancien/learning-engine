var fs = require('fs');
var moduleBroadcast = require('./global_broadcast');
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
    var users = {};
    var amountOfConnections = 0;
    //TIM
    /*******************************/
    var bullets = {};
    /*******************************/
    // LORS DE LA CONNEXION
    //On bind chaque event a l'élément socket retourné dans le callback
    //C'est un générateur de socket

    io.sockets.on('connection', function(socket) {
        amountOfConnections++;
        //a clean
        var user = [];
        var allUsers = [];
        //a garder
        var AllUsersIG = {};
        var sessionId = socket.id;
        socket.name = amountOfConnections;
        socket.set('id', id);

        /****\

        \****/

        moduleBroadcast(io,socket);

        /*Tim Socket
        io.sockets. => pour tout le monde
        socket. => juste le player
        socket.broadcast => tout le monde sauf le player
        
        *******************************************/
        //Créé un perso
        //CREATE OWN PLAYER Can be used by everyone for stocking player's information in the server
        socket.on("create player",function(player){
            var isExisting = false;
            for(var key in users){
                if(key == player.localName){
                    isExisting = true;
                    users[player.id] = player;
                    break;
                }
            }
            if(!isExisting){
                users[player.localName] = player;
                player.id = player.localName;
            }
            console.log("PLAYER CONNECTED ID° "+player.id)
            //CREATE OWN PLAYER FOR OTHERS
            socket.broadcast.emit('new player', player);
            //END CREATION EVENT
            socket.emit("creation over", player, users);
        });
        //UPDATE MOVE
        socket.on("own player has moved",function(ownUser){
            socket.broadcast.emit("new position",ownUser);
            users[ownUser.id].x = ownUser.x;
            users[ownUser.id].y = ownUser.y;
        });
        //DISCONNECT
        socket.on('disconnect', function(){
            console.log("PLAYER DISCONNECTED ID° "+socket.id)
            socket.broadcast.emit('player disconnected',{id:socket.id});
            delete users[socket.id];
        });
        //CREATE SHOOT
        socket.on("shoot",function(shoot){
            io.sockets.emit("shoot",shoot);
            if(!bullets[shoot.id]){
                bullets[shoot.id] = [];
            }
            bullets[shoot.id].push(shoot);
        });
        //UPDATE SHOOT
        socket.on("own shoot has moved", function(shoot){
            bullets[shoot.id][shoot.i].x = shoot.x;
            bullets[shoot.id][shoot.i].y = shoot.y;
        });
        //COLLISION
        socket.on("hit",function(hit){
            socket.broadcast.emit("hit",hit);
            users[hit.id].health -= hit.amountOfDamage;
            console.log("HIT ",hit.id," HEALTH=",users[hit.id].health);
        });
        //DEATH
        socket.on("death", function(death){
            socket.broadcast.emit("death",death);
            users[death.id].alive = false;
            console.log("DEATH OF ",death.id," HEALTH=",users[death.id].health);
        });
        //RESPAWN
        socket.on("respawn", function(player){
            socket.broadcast.emit("respawn",player);
            users[player.id].alive = true;
            users[player.id].health = player.health;
            console.log("RESPAWN OF ",player.id," HEALTH=",users[player.id].health);
        });
        //MODIF PLAYER  player = {player:{ALL-PROPERTIES-I-NEED-TO-UPDATE},id:MY-ID}
        socket.on("modification player", function(player){
            console.log("MODIFICATION OF PLAYER ID° ",player.id," START");
            for(var key in player.player){
                users[player.id][key] = player.player[key];
                console.log(key+"OF PLAYER ID° "+player.id+" IS NOW "+users[player.id][key]);
            }
            socket.broadcast.emit("modification player",player);
            console.log("MODIFICATION ON PLAYER ID° "+player.id+" END");
        });
        //LOAD EVERY USERS IN USERS ARRAY
        socket.on("load players",function(){
            socket.emit("load players", users);
        });
        /************************************/
        //     FIN DU CODE DE TIMOTENOOB    //


        // Connection du joueur
        socket.on("create new player",function(){
            AllUsersIG[sessionId] = sessionId;
            socket.emit("your player", sessionId);
            socket.emit('Add all Players', AllUsersIG)
            socket.broadcast.emit('new player', sessionId);
        });

        //on envoie les coordonées lors des déplacements
        socket.on('coords', function(data) {
            socket.broadcast.emit('coords update', data);
        });
        //Lorsque'on se déconnecte
        socket.on('disconnect', function(){
            socket.broadcast.emit('player left',sessionId);
            delete AllUsersIG[sessionId];
        });


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


    });

};
