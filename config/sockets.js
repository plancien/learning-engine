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
    var routineServerLoaded = false;
    var PublicServerStockingSpace = {};
    var PublicServerStockingSpaceKey = "default";
    /*******************************/
    // LORS DE LA CONNEXION
    //On bind chaque event a l'élément socket retourné dans le callback
    //C'est un générateur de socket

    io.sockets.on('connection', function(socket) {
        amountOfConnections++;
        /****\

        \****/

        moduleBroadcast(io,socket);
        //Init the server's routine for your game.
        //BEST WAY TO USE ==> in your eventBus.on("init"), connector.emit("load routine server -g", PublicServerStockingSpaceKey)
        socket.on("load routine server -g",function(path){
            if(path === ""){
                console.warn("Le chemin de votre module est manquant. Des problèmes surviendront surement très bientôt.");
            }
            PublicServerStockingSpaceKey = path;
            if(!PublicServerStockingSpace[path]){
                PublicServerStockingSpace[path] = {
                    users:{},
                };
            }
            if(!routineServerLoaded){
                var routineG = require("../public/scripts/modules/"+path)(io,socket,PublicServerStockingSpace[path]);
                routineServerLoaded = true;
            }
        })
        /**************************************************
        GENERIC EVENTS STOCKING INFORMATIONS IN USERS OBJECT
        **************************************************/
        //CREATE PLAYER
        //BEST WAY TO USE ==> player = {id:monID,player:{maPropriété1:value1,maPropriété2:value2}};
        socket.on("create player -g", function(data){
            //Si on n'a pas préciser les informations à stocker
            if(!data){
                data = {id:socket.id};
            }
            //Si l'id envoyé est incorrect
            if(data.id === ""){
                data.id = socket.id;
            }
            //On stocke chaque valeur contenu dans player dans users[player.id] un objet représentant le joueur
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id] = {};
            for(var key in data){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id][key] = data[key];
            }
            console.log("PLAYER",data.id," CREATED");
            //On envoie les données contenu dans player à tout les autres
            socket.broadcast.emit("new player",data);
        });

        //MODIF PLAYER  
        //BEST WAY TO USE ==> data = {id:monID,eventName:MonEventCustom,info:{maPropriétéAUpdata1:value1,maPropriétéAUpdate2:value2}}
        socket.on("infoToSync -g", function(data){
            //Si on a oublié de préciser l'id
            if(!data.id){
                data.id = socket.id;
            }
            //Si cet id n'est pas dans le tableau utilisateurs
            if(!PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id]){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id] = {};
                console.log("UNKNOWN ID OF PLAYER IN USERS");
            }
            //On attribue chaque valeur contenu dans data.player a chaque propriété de user[data.id]
            for(var key in data.info){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id][key] = data.info[key];
                console.log(key+"OF PLAYER ID° "+data.id+" IS NOW "+PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.id][key]);
            }
            if(!data.info.id){
                data.info.id = data.id;
            }
            //Si votre modification implique d'envoyer une info supplémentaire sur le type de modification
            if(data.eventName){
                socket.broadcast.emit(data.eventName,data.info);
            }
            else{
                socket.broadcast.emit('Synchronization',data.info);
            }
        });
        //LOAD EVERY USERS IN USERS ARRAY
        //BEST WAY TO USE ==> Just call it (y)
        socket.on("load players -g",function(){
            console.log("PLAYER ID° "+socket.id+" HAS LOAD ALL PLAYERS");
            socket.emit("load players", PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"]);
        });

        function bonusGenerate(arg){
            for(var key in arg['arg']){
                eval(arg['arg'][key]);
                console.log(x)
            }
        }
        //DISCONNECT
        //BEST WAY TO USE ==> N/A
        socket.on('disconnect', function(){
            console.log("PLAYER DISCONNECTED ID° "+socket.id+PublicServerStockingSpaceKey)
            socket.broadcast.emit('player disconnected',{id:socket.id});
            delete PublicServerStockingSpace[PublicServerStockingSpaceKey][socket.id];
        });
        /************************************/

        /*Tim Socket
        io.sockets. => pour tout le monde
        socket. => juste le player
        socket.broadcast => tout le monde sauf le player
        
        *******************************************/
        socket.on("create player",function(player){
            var isExisting = false;
            for(var key in PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"]){
                if(key == player.localName){
                    isExisting = true;
                    PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.id] = player;
                    break;
                }
            }
            if(!isExisting && player.localName != ""){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.localName] = player;
                player.id = player.localName;
                socket.id = player.id;
            }
            else{
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.id] = player;
            }
            console.log("PLAYER CONNECTED ID° "+player.id)
            //CREATE OWN PLAYER FOR OTHERS
            socket.broadcast.emit('new player', player);
            //END CREATION EVENT
            socket.emit("creation over", player, PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"], PublicServerStockingSpace[PublicServerStockingSpaceKey]["powerUp"]);
        });
        
        //CREATE SHOOT
        socket.on("shoot",function(shoot){
            io.sockets.emit("shoot",shoot);
            if(!PublicServerStockingSpace[PublicServerStockingSpaceKey]["bullets"][shoot.id]){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["bullets"][shoot.id] = [];
            }
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["bullets"][shoot.id].push(shoot);
        });
        //UPDATE SHOOT
        socket.on("own shoot has moved", function(shoot){
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["bullets"][shoot.id][shoot.i].x = shoot.x;
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["bullets"][shoot.id][shoot.i].y = shoot.y;
        });
        //UPDATE MOVE
        socket.on("own player has moved", function(user){
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][user.id].x = user.x;
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][user.id].y = user.y;
            socket.broadcast.emit("new position",user);
        });
        //COLLISION
        socket.on("hit",function(hit){
            socket.broadcast.emit("hit",hit);
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][hit.id].health -= hit.amountOfDamage;
            console.log("HIT ",hit.id," HEALTH=",PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][hit.id].health);
        });
        //DEATH
        socket.on("death", function(death){
            socket.broadcast.emit("death",death);
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][death.id].alive = false;
            console.log("DEATH OF ",death.id," HEALTH=",PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][death.id].health);
        });
        //RESPAWN
        socket.on("respawn", function(player){
            socket.broadcast.emit("respawn",player);
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.id].alive = true;
            PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.id].health = player.health;
            console.log("RESPAWN OF ",player.id," HEALTH=",PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][player.id].health);
        });
        //POWER UP
        socket.on("player get powerup", function(data){
            for(var key in data.player){
                PublicServerStockingSpace[PublicServerStockingSpaceKey]["users"][data.idPlayer][key] = data.player[key];
                console.log("PLAYER ID° "+data.idPlayer+" "+key+" IS NOW "+data.player[key]);
            }
            socket.broadcast.emit("player get powerup",data)
            delete PublicServerStockingSpace[PublicServerStockingSpaceKey]["powerUp"][data.idPowerUp];
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
