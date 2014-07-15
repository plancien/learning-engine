
var games = require(__path.model+"/game");
var users = require(__path.model+"/users");

module.exports = function (req, res) {
    var userName = req.session.userName;
    var gameName = req.params.gameName;
    if (userName){
        users.haveGame(userName, gameName, function(have){
            if (have){
                users.deleteGame(userName, gameName, function(){
                    games.deleteGame(gameName, function(){
                        res.redirect("/my_game");
                    });
                });
            }
            else{
                res.send("Vous ne possedez pas ce jeu");
            }
        });
    }
};
