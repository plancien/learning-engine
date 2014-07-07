var pageManager = require(__path.controller+"/pageManager");
var mamm = require(__path.model + "/multiple_action_model_manageur.js");
var games = require(__path.model + "/game");

module.exports = function(){
  var my_game = pageManager.add("my_game", 
    function(req, res){             //get
        var that = this;
        if (req.session.userName){
            mamm.getUserGame(req.session.userName, function(spec){
                if (spec.length <= 0){                          //Si l'utilisateur de possède aucun jeu
                    games.getDefaultGame(function(spec){            //On lui permet d'avoir acces aux jeu par défault
                        that.display(req, res, "my_game", spec);
                    });
                }
                else{
                    that.display(req, res, "my_game", spec);
                }
            });
        }
        else{
            res.redirect("/login");
        }
    }
  );

  pageManager.addOn("my_game", "test",
    function(req, res){
        res.send("ok");
    });
};