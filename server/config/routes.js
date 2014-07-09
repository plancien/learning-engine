
var fs = require('fs');
var url = require('url');

var controller = {};
var pathUrlController = __dirname + "/../url_controller/";
var files = fs.readdirSync(pathUrlController);

    //var controller.nomFichier = require("Lefichier"); Pour tous le dossier url_controller
for (var i = files.length - 1; i >= 0; i--) {
    var name = files[i].split(".")[0];
    controller[name] = require(pathUrlController+"/"+files[i]);
}

module.exports = function(app) {


    app.get("/",                controller.home);
    app.get("/home",            controller.home);

    app.get("/login",           controller.login.get);
    app.post("/login",          controller.login.post);
    app.post("/signup",         controller.login.signup);

    app.get("/create_game",     controller.create_game.get);
    app.post("/create_game",    controller.create_game.post);

    app.get("/my_images",       controller.my_images.get);
    app.post("/my_images",      controller.my_images.post);

    app.get("/my_game",         controller.my_game);

    app.get("/my_images/delete/:imageName", controller.delete_image);

    app.get("/game/:gameName",              controller.game);
    app.get("/game/delete/:gameName",       controller.game_delete);

    app.get("/game/edit/:gameName",       controller.game_edit.get);
    app.post("/game/edit/:gameName",      controller.game_edit.post);


    app.get("/logout",          controller.logout);
};

