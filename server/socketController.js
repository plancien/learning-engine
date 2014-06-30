var fs = require("fs");
var games = require(__dirname+"/model/game");
var img = require(__dirname+"/model/img");
var user = require(__dirname+"/model/users");

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