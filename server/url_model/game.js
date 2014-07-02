var pageManager = require(__path.controller+"/pageManager");

module.exports = function(){
	pageManager.add("game", 
	function(req, res, pathRest){				//get
		if (pathRest[0]){
			this.display(req, res, "welcome");
		}
		else
			res.redirect("/login");
	}
)};