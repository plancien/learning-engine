
module.exports = function(req, res){
	if (req.session.userName)
		res.render("page/welcome");
	else
		res.redirect("/login");
};
