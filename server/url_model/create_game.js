var pageManager = require(__path.controller+"/pageManager");

module.exports = function(){
	pageManager.add("create_game", 
	function(req, res){				//get
		this.display(req, res, "create_game");
	}
)};