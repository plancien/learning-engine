
var fs = require("fs");
var games = require(__path.model+"/game");
var img = require(__path.model+"/img");
var user = require(__path.model+"/users");

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

    socket.on("want images names", function() {
        img.getGamesImages(user.getUserImageSync(socket.name), function(err,imgs) {
            socket.emit('images names',imgs );
        });
    });

    socket.on("update score",function(point) {
        socket.broadcast.emit("update score",socket.name,point);
    });

    socket.on("want all sessions", function(){
        games.getDefaultGame(function(defaultFiles){
            user.getListGame(socket.name, function(list){
                games.exportListGame(list, function(userFiles){
                    socket.emit("live sessions", defaultFiles.concat(userFiles));
                });
            });
        });
    });

    socket.on("create game",function(gameInfo) {
        games.addGame(gameInfo, function(gameData){
            user.addGame(socket.name, gameData.name, function(){
                socket.emit("redirect game", gameInfo);
            });
        });
    });

    socket.on("want session info", function(name) {
        games.get(name, function(game){
            socket.emit("session info", game);
        });
    });




    socket.on("want template", function(data) {
        var path = rootPath + "./public/templates/" + data + ".html";
        var template = "";
        if (fs.existsSync(path)) {
            template = fs.readFileSync(path, "utf8");
        }
        socket.emit("inject template", template);
    });

}