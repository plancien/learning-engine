
var games = require(__path.model+"/game");
var mamm = require(__path.model+"/multiple_action_model_manageur");
var users = require(__path.model+"/users");


module.exports = {
    "gameForm" : function(req, res){
        var gameName = req.params.gameName;
        var userName = req.session.userName;

        if (userName){
            users.haveGame(userName, gameName, function(have){
                if (have){
                    mamm.getCreateGameInfos(userName, function(spec){
                        games.get(gameName, function(gameInfo){
                            spec.gameInfos = gameInfo;
                            res.render("page/game_edit", {"spec" : spec});
                        });
                    });
                }
                else{
                    res.redirect("/games");
                }
            });
        }
        else{
            res.redirect("/login");
        }
    },

    "updateGame" : function(req, res){
        var gameName = req.params.gameName;
        var userName = req.session.userName;
        if (userName){
            users.haveGame(userName, gameName, function(have){
                if (have){
                    games.modify(gameName, req.body, function(){
                        res.redirect("/game/"+gameName);
                    });
                }
                else{
                    res.redirect("/my_game");
                }
            });
        }
    }
};
