var pageManager = require(__path.controller+"/pageManager");
var games = require(__path.model+"/game");

module.exports = function(){
	pageManager.add("game", 
	function(req, res, pathRest){				//get
		var that = this;
		if (pathRest[0]){		//Si on a demande un jeu
			if (!pathRest[1]){	//Et qu'on ne veut rien lui faire
				//aller chercher le jeu en fonctiojn du nom
				games.get(pathRest[0], function(data){
					console.log(data);
					that.display(req, res, "game", data);
				});
			}
			else{
				res.send("En dev");
			}
		}
		else
			res.redirect("/my_game");
	}
)};