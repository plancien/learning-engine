
var display = require(__dirname + "/../controller/defaultDisplay.js");
var mamm = require(__path.model + "/multiple_action_model_manageur.js");
var games = require(__path.model + "/game");

module.exports = function(req, res){
	var userName = req.session.userName;
    if (userName){
        mamm.getUserGame(userName, function(spec){
            if (spec.length <= 0){                          //Si l'utilisateur de possède aucun jeu
                games.getDefaultGame(function(spec){            //On lui permet d'avoir acces aux jeu par défault
                    display(req, res, "my_game", spec);
                });
            }
            else{
                display(req, res, "my_game", spec);
            }
        });
    }
    else{
        res.redirect("/login");
    }
};
