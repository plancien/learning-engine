var pageManager = require(__path.controller+"/pageManager");
var users = require(__path.model+"/users");

module.exports = function(){
	pageManager.add("signup", 
	function(req, res){				//get
		res.redirect("/login");
	},
	function(req, res){				//post
	    users.save(req.body.username,req.body.password,function(err) {
	        if (err) {
	            res.send("Error : " + err.message);
	        } else {
	            res.redirect("/login");
	        }
	    });
	}	
)};
