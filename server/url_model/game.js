
var pageManager = require(__path.controller+"/pageManager");
var games = require(__path.model+"/game");
var users = require(__path.model+"/users");
var mamm = require(__path.model+"/multiple_action_model_manageur");

module.exports = function(){
    pageManager.add("game", 
    function(req, res, pathRest){               //get
        var that = this;
        var gameName = pathRest[0];
        var actionOnGame = pathRest[1];

        if (gameName){      //Si on a demande un jeu
            if (actionOnGame == "delete"){  //Et qu'on ne veut rien lui faire
                if (userName = req.session.userName){
                    users.haveGame(userName, gameName, function(have){
                        if (have){
                            users.deleteGame(userName, gameName);
                            games.deleteGame(gameName);
                            res.redirect("/my_game");
                        }
                        else{
                            res.send("Vous ne possedez pas de jeu de ce nom");
                        }
                    });
                }
            }
            else if (actionOnGame == "edit"){
                if (userName = req.session.userName){
                    users.haveGame(userName, gameName, function(have){
                        if (have){
                            mamm.getCreateGameInfos(userName, function(spec){
                                games.get(gameName, function(gameInfo){
                                    spec.gameInfos = gameInfo;
                                    that.display(req, res, "game_edit", spec);
                                });
                            });
                        }
                        else{
                            res.redirect("/my_game");
                        }
                    });
                }
                else{
                    res.redirect("/login");
                }

            }
            else if (!actionOnGame){
                console.log("on rentre dans le chargement de jeu : " + gameName);
                games.get(gameName, function(data){

                    that.display(req, res, "game", data);
                });
            }
        }
        else
            res.redirect("/my_game");
    },
    function(req, res, pathRest){
        var gameName = pathRest[0];
        var actionOnGame = pathRest[1];

        if (actionOnGame == "edit"){
            if (userName = req.session.userName){
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
            else{
                res.redirect("login");
            }
        }
    }
)};
