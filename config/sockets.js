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
    var powerUp = {};
    /******************************
    Cette boucle est appelée toute les 30 secondes
    elle rajoute un power Up sur la map et dans le tableau de power up
    ******************************/
    setInterval(function(){
        var powerup = {
            type:((Math.random()*3)|0)+1,
            x:Math.random()*700,
            y:Math.random()*500,
            w: 30,
            h: 30,
            id:(Math.random()*100000000)|0
        };
        switch(powerup.type){
            case 1:
            powerup.modification = {health: 30};
            powerup.color = "green";
            break;
            case 2:
            powerup.modification = {bulletDamage: 10};
            powerup.color = "rouge";
            break;
            case 3:
            powerup.modification = {h:20,w:20,bulletDamage:20};
            powerup.color = "orange";
            break;
            default:
            powerup.modification = {speed: 5};
            powerup.color = "white";
        }
        io.sockets.emit("new powerup",powerup);
        powerUp[powerup.id] = powerup;
        console.log("NEW POWERUP ID° "+powerup.id);
    },25*1000);
    /*******************************/
    // LORS DE LA CONNEXION
    //On bind chaque event a l'élément socket retourné dans le callback
    //C'est un générateur de socket

    io.sockets.on('connection', function(socket) {
        amountOfConnections++;
        /****\

        \****/

        moduleBroadcast(io,socket);
        /**************************************************
        GENERIC EVENTS STOCKING INFORMATIONS IN USERS OBJECT
        **************************************************/
        //CREATE PLAYER
        //BEST WAY TO USE ==> player = {id:monID,player:{maPropriété1:value1,maPropriété2:value2}};
        socket.on("create player -g", function(data){
            //Si on n'a pas préciser les informations à stocker
            if(!data){
                var data = {id:socket.id};
            }
            //Si l'id envoyé est incorrect
            if(data.id == ""){
                data.id = socket.id;
            }
            console.log(users,data)
            //On stocke chaque valeur contenu dans player dans users[player.id] un objet représentant le joueur
            for(var key in data){
                users[data.id] = {}
                users[data.id][key] = data[key];
            }
            //On envoie les données contenu dans player à tout les autres
            socket.broadcast.emit("new player",data);
        });
        //MODIF PLAYER  
        //BEST WAY TO USE ==> data = {id:monID,eventName:MonEventCustom,player:{maPropriétéAUpdata1:value1,maPropriétéAUpdate2:value2}}
        socket.on("modification player -g", function(data){
            console.log("MODIFICATION OF PLAYER ID° ",data.id," START");
            //Si on a oublié de préciser l'id
            if(!data.id){
                data.id = socket.id;
            }
            //Si cet id n'est pas dans le tableau utilisateurs
            if(!users[data.id]){
                users[data.id] = {};
                console.log("UNKNOWN ID OF PLAYER IN USERS");
            }
            //On attribue chaque valeur contenu dans data.player a chaque propriété de user[data.id]
            for(var key in data.player){
                users[data.id][key] = data.player[key];
                console.log(key+"OF PLAYER ID° "+data.id+" IS NOW "+users[data.id][key]);
            }
            //Si votre modification implique d'envoyer une info supplémentaire sur le type de modification
            if(data.eventName){
                socket.broadcast.emit(data.eventName,data);
            }
            else{
                socket.broadcast.emit('modification player',data);
            }
            console.log("MODIFICATION ON PLAYER ID° "+data.id+" END");
        });
        //UPDATE SPECIFIC FOR MOVE
        socket.on("coords -g",function(ownUser){
            socket.broadcast.emit("new position",ownUser);
            users[ownUser.id].x = ownUser.x;
            users[ownUser.id].y = ownUser.y;
        });
        //LOAD EVERY USERS IN USERS ARRAY
        //BEST WAY TO USE ==> Just call it 
        socket.on("load players -g",function(){
            socket.emit("load players", users);
            console.log("PLAYER ID° "+socket.id+" HAS LOAD ALL PLAYERS");
        });
        //DISCONNECT
        //BEST WAY TO USE ==> N/A
        socket.on('disconnect', function(){
            console.log("PLAYER DISCONNECTED ID° "+socket.id)
            socket.broadcast.emit('player disconnected',{id:socket.id});
            delete users[socket.id];
        });
        /************************************/

        /*Tim Socket
        io.sockets. => pour tout le monde
        socket. => juste le player
        socket.broadcast => tout le monde sauf le player
        
        *******************************************/
        socket.on("create player",function(player){
            var isExisting = false;
            for(var key in users){
                if(key == player.localName){
                    isExisting = true;
                    users[player.id] = player;
                    break;
                }
            }
            if(!isExisting && player.localName != ""){
                users[player.localName] = player;
                player.id = player.localName;
            }
            else{
                users[player.id] = player;
            }
            console.log("PLAYER CONNECTED ID° "+player.id)
            //CREATE OWN PLAYER FOR OTHERS
            socket.broadcast.emit('new player', player);
            //END CREATION EVENT
            socket.emit("creation over", player, users, powerUp);
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
        //UPDATE MOVE
        socket.on("own player has moved", function(user){
            users[user.id].x = user.x;
            users[user.id].y = user.y;
            socket.broadcast.emit("new position");
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
        //POWER UP
        socket.on("player get powerup", function(data){
            for(var key in data.player){
                users[data.idPlayer][key] = data.player[key];
                console.log("PLAYER ID° "+data.idPlayer+" "+key+" IS NOW "+data.player[key]);
            }
            socket.broadcast.emit("player get powerup",data)
            delete powerUp[data.idPowerUp];
        });

        //     FIN DU CODE DE TIMOTENOOB    //


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
