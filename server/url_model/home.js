var pageManager = require(__path.controller+"/pageManager");

module.exports = function(){
	pageManager.add("home", 
	function(req, res){				//get
		if (req.session.userName)
			this.display(req, res, "welcome");
		else
			res.redirect("/login");
	}
)};