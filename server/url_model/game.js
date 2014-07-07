
var pageManager = require(__path.controller+"/pageManager");
var games = require(__path.model+"/game");
var users = require(__path.model+"/users");

module.exports = function(){
    pageManager.add("game", 
    function(req, res, pathRest){               //get
        var that = this;
        var gameName = pathRest[0];
        var actionOnGame = pathRest[1];

        if (gameName){      //Si on a demande un jeu
            if (actionOnGame == "delete"){  //Et qu'on ne veut rien lui faire
                console.log("On rentre dans le delete");
                    
                if (userName = req.session.userName){
                    console.log("userName : " + userName);
                        
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
                console.log("On rentre dans le edit");
                    
                res.send("On vas venir essayer de modifier le jeu");
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
    }
)};
