
var mamm = require(__path.model + "/multiple_action_model_manageur.js");
var games = require(__path.model + "/game");

module.exports = function(req, res){
	var userName = req.session.userName;
    if (userName){
        mamm.getUserGame(userName, function(spec){
            console.log();
                
            if (spec.length <= 0){                          //Si l'utilisateur de possède aucun jeu
                games.getDefaultGame(function(spec){            //On lui permet d'avoir acces aux jeu par défault
                    res.render("page/my_game", {"spec" : spec});
                });
            }
            else{
                res.render("page/my_game", {"spec" : spec});
            }
        });
    }
    else{
        res.redirect("/login");
    }
};
