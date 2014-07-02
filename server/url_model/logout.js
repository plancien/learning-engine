var pageManager = require(__path.controller+"/pageManager");
var users = require(__path.model+"/users");

module.exports = function(){
	pageManager.add("logout", 
	function(req, res){				//get
		req.session.destroy();
		res.redirect("/login");
	}
)};
