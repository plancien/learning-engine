
var display = require(__dirname + "/../controller/defaultDisplay.js");
var users = require(__path.model+"/users");


module.exports = {
	"get" : function(req, res){
		if (req.session.userName)
			res.redirect("/home");
		else
			display(req, res, "login");
	},

	"post" : function(req, res){
        users.log(req, function(successful){
            if (successful){
                req.session.userName = req.body.username;
                res.redirect("/home");
            }
            else{
                res.redirect("/login");
            }
        });
	}
};
