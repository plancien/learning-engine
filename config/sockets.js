var fs = require('fs');
var moduleBroadcast = require('./global_broadcast');
var rootPath = require('path').join(__dirname, '../');
var img = require("../server/img.js");

module.exports = function(io) {

    function getFileInfos(path) {
        var games = fs.readdirSync(path);
        var gameNames = [];
        var fileNames = [];
        var descriptions = [];
        var templates = [];

        for (var i = 0; i < games.length; i++) {
            if (games[i].indexOf('.js') == -1)
                continue;
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

    //-GForce API
    /*******************************/
    var routineServerLoaded = {
        default:false
    }
    var PublicServerStockingSpace = {};
    var PublicServerStockingSpaceKey = {
        default:"default"
    };
    var routineG = {};
    
    
    
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
                    -GForce API
        **************************************************/
        //Init the server's routine for your game.
        //BEST WAY TO USE ==> in your eventBus.on("init"), connector.emit("load routine server -g", PublicServerStockingSpaceKey)
        socket.on("load routine server -g", function(routine){

            //Warning path
            if(routine['path'] === ""){
                console.warn("Le chemin de votre module est manquant. Des problèmes surviendront surement très bientôt. lol");
            }

            //Set path
            socket.currentGame = routine["path"];
            PublicServerStockingSpaceKey[routine["path"]] = routine['path'];

            //Create private stocking space
            if(!PublicServerStockingSpace[routine['path']]){
                PublicServerStockingSpace[routine['path']] = {
                    users: {}
                };
            }

            //Load routine
            if(!routineServerLoaded[routine["path"]]){
                routineG[PublicServerStockingSpaceKey[socket.currentGame]] = require("../public/scripts/modules/"+routine['path'])(io,socket,PublicServerStockingSpace[socket.currentGame],routine['info']);
                routineServerLoaded[routine["path"]] = true;
                console.log("ROUTINE LOADED");
            }
        });
        
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
            PublicServerStockingSpace[socket.currentGame]["users"][data.id] = {};
            for(var key in data){
                PublicServerStockingSpace[socket.currentGame]["users"][data.id][key] = data[key];
            }

            //On envoie les données contenu dans player à tout les autres
            socket.broadcast.emit("new player",data);

            console.log("PLAYER",data.id," CREATED");
        });
        
        
        //GAME OVER
        socket.on("game over -g", function(data){
            io.sockets.emit('game over',data);
        });
        
        
        
        //MODIF PLAYER  
        //BEST WAY TO USE ==> data = {id:IDDeLObjetAModifier,eventName:MonEventCustom,objectKey:LObjetAModifier,update:{maPropriétéAStocker:value1,...},send:{maPropriétéAUpdata1:value1,maPropriétéAUpdate2:value2}}
        socket.on("infoToSync -g", function(data){
            
            //Si on a oublié de préciser l'id
            if(!data.id){
                data.id = socket.id;
            }
            
            //Si on a oublié de préciser la table a modifié
            if(!data.objectKey){
                data.objectKey = "users";
            }
            
            //Si c'est la première fois qu'on modifie cette table, on la créé ainsi que l'id lui correspondant
            if(!PublicServerStockingSpace[socket.currentGame][data.objectKey]){
                PublicServerStockingSpace[socket.currentGame][data.objectKey] = {};
                PublicServerStockingSpace[socket.currentGame][data.objectKey][data.id] = {};
                console.log("UNKNOWN ID "+data.id+" In "+data.objectKey+" CREATING IT.");
            }
            
            //Si cet id n'est pas connu de l'objet
            if(!PublicServerStockingSpace[socket.currentGame][data.objectKey][data.id]){
                PublicServerStockingSpace[socket.currentGame][data.objectKey][data.id] = {};
                console.log("UNKNOWN ID "+data.id+" In "+data.objectKey+" CREATING IT.");
            }
            
            //On attribue chaque valeur contenu dans data.player a chaque propriété de user[data.id]
            for(var key in data.update){
                PublicServerStockingSpace[socket.currentGame][data.objectKey][data.id][key] = data.update[key];
                console.log(key+"OF "+data.objectKey+" ID° "+data.id+" IS NOW "+PublicServerStockingSpace[socket.currentGame][data.objectKey][data.id][key]);
            }
            
            //Si on a pas préciser l'id dans les info
            if(!data.send){
                data.send = {id:data.id};
            }
            
            if(!data.send.id){
                data.send.id = data.id;
            }
            
            //Si votre modification implique d'envoyer une info supplémentaire sur le type de modification
            if(data.eventName){
                socket.broadcast.emit(data.eventName,data.send);
            } 
            else{
                socket.broadcast.emit('Synchronization',data.send);
            } 
        });
        
        
        //LOAD EVERY USERS IN USERS ARRAY
        //BEST WAY TO USE ==> .emit without parameters to load the users or with parameters to load any other array
        socket.on("load -g",function(keyToLoad){
            if(!keyToLoad){
                socket.emit("load players", PublicServerStockingSpace[socket.currentGame]["users"]);
                console.log("PLAYER ID° "+socket.id+" HAS LOAD ALL PLAYERS");
            }
            else{
                socket.emit("load "+keyToLoad, PublicServerStockingSpace[socket.currentGame][keyToLoad]);
                console.log("PLAYER ID° "+socket.id+" HAS LOAD ALL "+keyToLoad);
            }
        });
        
        
        
        //DELETE THE OBJECT -> SERVER-SIDE
        //BEST WAY TO USE ==> {idObject:ID-IN-THE-OBJECTKEY-ARRAY,objectKey:NAME-OF-THE-ARRAY}
        socket.on("delete info -g",function(data){

            //data has been send and contain objectKey and idObject too
            if(!!data && data.objectKey && data.idObject){

                //If associative array "objectKey" exist and the id in associative array "objectKey" exist too
                if(!!PublicServerStockingSpace[socket.currentGame][data.objectKey] && PublicServerStockingSpace[socket.currentGame][data.objectKey][data.idObject]){
                    console.log("DELETE "+data.idObject+ " OF "+data.objectKey+" DONE.");
                    delete PublicServerStockingSpace[socket.currentGame][data.objectKey][data.idObject];
                }
            }
        });
        
        
        //DISCONNECT
        //BEST WAY TO USE ==> N/A
        socket.on('disconnect', function(){

            socket.broadcast.emit('player disconnected', {id:socket.id});
            console.log("PLAYER DISCONNECTED ID° "+socket.id);
            if(!!PublicServerStockingSpace[socket.currentGame] && PublicServerStockingSpace[socket.currentGame]["users"][socket.id]){
                console.log("PLAYER ID° "+socket.id+" DELETED FROM USERS");
                console.log("socket currentGame",socket.currentGame,PublicServerStockingSpaceKey[socket.currentGame])
                delete PublicServerStockingSpace[socket.currentGame]["users"][socket.id];
                
                var i = 0;
                for(var key in PublicServerStockingSpace[socket.currentGame]["users"]){
                    i++;
                }
                //If no player remaining
                if(i == 0 && routineServerLoaded[socket.currentGame] == true){
                    clearInterval(routineG[socket.currentGame]);
                    routineServerLoaded[socket.currentGame] = false;
                    console.log("ROUTINE CLEAR")
                }
            }
        });
        
        
        
        /************************************/
        /*io.sockets. => pour tout le monde
          socket. => juste le player
          socket.broadcast => tout le monde sauf le player
        *******************************************/
        socket.on("ask images names", function() {
            var names = fs.readdirSync("./public/images");
            console.log(names);
            img.getGamesImages(function(err,imgs) {
                console.log(imgs, "<-- that")
                socket.emit('send images names',imgs );
            })
        });
         ///
         /*

        socket.on("ask images names", function() {
            var names = fs.readdirSync("./public/images");
            console.log(names);
            img.getGamesImages(function(err,imgs) {
                socket.emit('send images names',imgs );
            })
        });
*/
        ///

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
