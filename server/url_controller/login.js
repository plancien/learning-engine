
var users = require(__path.model+"/users");


module.exports = {
	"get" : function(req, res){
		if (req.session.userName)
			res.redirect("/home");
		else
			res.render("page/login", resMessage());
	},

	"post" : function(req, res){
        users.log(req, function(successful){
            if (successful){
                req.session.userName = req.body.username;
                res.redirect("/home");
            }
            else{
                res.render("page/login", resMessage("Ce pseudo n'existe pas ou ne s'accorde pas avec le mot de passe"));
            }
        });
	},
    "signup" : function(req, res){
        users.save(req.body.username,req.body.password,function(err) {
            if (err) {
                res.render("page/login", resMessage(null, err));
            } else {
                res.render("page/login", resMessage(null, "Vous êtes bien inscrit sous le pseudo '"+req.body.username+"'"))
            }
        });
    }   

};

function resMessage(login, signup){
    message = {
        "login" : login || "",
        "signup" : signup || ""
    };
    return message;
}
