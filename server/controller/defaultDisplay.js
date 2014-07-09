
module.exports = function(req, res, page, spec){
	var data = {
        page : page || "welcome",
        userName : req.session.userName || false
    };

    if (spec){
        data.spec = spec;
    }
    res.render("index.html", data);
}
