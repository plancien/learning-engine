var games = require(__dirname+"/game");
var fs = require("fs");
var img = require(__dirname+"/img");
var user = require(__dirname+"/users");

module.exports.register = function register (socket,io) {

    socket.on("want games info", function() {
        socket.emit('games info',games.getGamesList());
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
        img.getGamesImages(user.getUserImageSync(socket.name), function(err,imgs) {
            socket.emit('images names',imgs );
        })
    });

    socket.on("update score",function(point) {
        socket.broadcast.emit("update score",socket.name,point)
    });

}