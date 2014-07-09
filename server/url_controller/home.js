
var display = require(__dirname + "/../controller/defaultDisplay.js");

module.exports = function(req, res){
	if (req.session.userName)
		display(req, res, "welcome");
	else
		res.redirect("/login");
};
