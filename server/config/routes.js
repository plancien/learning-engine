
var fs = require('fs');
var url = require('url');

var controller = {};
var pathUrlController = __dirname + "/../controllers/";
var files = fs.readdirSync(pathUrlController);

    //var controller.nomFichier = require("Lefichier"); Pour tous le dossier controllers
for (var i = files.length - 1; i >= 0; i--) {
    var name = files[i].split(".")[0];
    controller[name] = require(pathUrlController+"/"+files[i]);
}

module.exports = function(app) {

    app.get("/",                controller.home);
    app.get("/home",            controller.home);

    app.get("/login",           controller.login.newForm);
    app.post("/login",          controller.login.checkForm);
    // app.post("/signup",         controller.login.signup);

    app.get("/games/create",     controller.create_game.newForm);
    app.post("/games/create",    controller.create_game.newGame);

    app.get("/my_images",       controller.my_images.displayUserImages);
    app.post("/my_images",      controller.my_images.add);
    app.get("/my_images/delete/:imageName", controller.my_images.removed);

    app.get("/games",         controller.my_game);


    app.get("/games/:gameName",              controller.game);
    app.get("/games/delete/:gameName",       controller.game_delete);

    app.get("/games/edit/:gameName",       controller.game_edit.gameForm);
    app.post("/games/edit/:gameName",      controller.game_edit.updateGame);

    app.get("/logout",          controller.logout);

    app.get("/*", controller.does_not_exist);
};

