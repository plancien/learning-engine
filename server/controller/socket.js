
var fs = require("fs");
var games = require(__path.model+"/game");
var img = require(__path.model+"/img");
var user = require(__path.model+"/users");
// var sessions = require(__dirname+"/../sessions");

module.exports.register = function register (socket,io) {

    socket.on("name", function(name) {
        socket.name = name;
        socket.emit("autentificated");
    });

    socket.on("disconnect", function() {
        socket.broadcast.emit('player disconnected', {
            id: socket.id
        });
    });


    socket.on("want games info", function() {
        socket.emit('games info', games.getGamesList());
    });

    socket.on("want template", function(data) {
        var path = rootPath + "./public/templates/" + data + ".html";
        var template = "";
        if (fs.existsSync(path)) {
            template = fs.readFileSync(path, "utf8");
        }
        socket.emit("inject template", template);
    });

    socket.on("want images names", function() {
        img.getGamesImages(user.getUserImageSync(socket.name), function(err,imgs) {
            socket.emit('images names',imgs );
        })
    });

    socket.on("update score",function(point) {
        socket.broadcast.emit("update score",socket.name,point);
    });

    socket.on("want all sessions", function(){
        //Doit renvoyer un tableau associatif contenant tous les parametre des jeux
        games.getDefaultGame(function(files){
            socket.emit("live sessions", files);
        });
    });






    // socket.on("create game",function(gameInfo) {
    //     sessions.create(gameInfo, socket.name);
    //     socket.emit("redirect game", gameInfo);
    // });

    // socket.on("connect to game",function(gameName) {
    //     sessions.connectToGame(gameName, function(err, session){
    //         if (err){
    //             console.log(err);
    //         }
    //         else{
    //             socket.on("disconnect",function() {
    //                 session.players.splice(session.players.indexOf(socket.name),1);
    //             });
    //             socket.emit("join game", session);
    //         };
    //     });
    // });

    // socket.on("want session info", function(name) {
    //     sessions.getSession(name, function(err, session){
    //         if (err){
    //             console.log(err);
    //         }
    //         else{
    //             socket.emit("session info", session);
    //         }
    //     })
    // });

    // socket.on("want all sessions", function() {
        
    // });

    // socket.on("update game", function(game) {
    //     updateSession(game);
    //     socket.emit("redirect game",game)
    // });

    // socket.on("delete session", deleteSession);

}