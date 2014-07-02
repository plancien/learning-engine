var pageManager = require(__path.controller+"/pageManager");
var mamm = require(__path.model + "/multiple_action_model_manageur.js");

module.exports = function(){
  pageManager.add("my_game", 
	function(req, res){				//get
		var that = this;
		if (req.session.userName){
			mamm.getDefaultAndUserGame(req.session.userName, function(spec){
				that.display(req, res, "my_game", spec);
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