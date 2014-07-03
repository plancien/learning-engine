
var pageManager = require(__path.controller+"/pageManager");
var images = require(__path.model + "/img");
var games = require(__path.model+"/game");
var users = require(__path.model + "/users");



module.exports = function(){
	pageManager.add("create_game", 
	function(req, res){				//get
		var that = this;
		if (userName = req.session.userName){
			var spec = {}
			spec.gameList = games.getGamesList();
	        images.getDefaultUrl(function(err,imgs) {
	            spec.imagesList = imgs;
				that.display(req, res, "create_game", spec);
	        });
	    }
	    else{
	    	res.redirect("/login");
	    }
	},

	function(req, res){				//post
		console.log(req.body);
	}
)};