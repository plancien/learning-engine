var games = require(__dirname+"/game");
var fs = require("fs");
var img = require(__dirname+"/img");

module.exports.register = function register (socket) {
    socket.on("want games info", function() {
        socket.emit('games info',games.getGamesList());
        //socket.emit('games info', {
        //    games: games.getGamesList(),
        //    models: games.getGamesList(__dirname +"/../public/scripts/games/")
        //});
    });

    socket.on("want css", function(data) {
        var path = "css/" + data + ".css";
        if (fs.existsSync("./public/" + path)) {
            socket.emit("inject css", path);
        }
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
        var names = fs.readdirSync("./public/images");
        console.log(names);
        img.getGamesImages(function(err,imgs) {
            console.log(imgs, "<-- that")
            socket.emit('images names',imgs );
        })
    });
}