
var games = require(__path.model+"/game");

module.exports = function(req, res){
	var gameName = req.params.gameName;

    games.get(gameName, function(data){
        res.render("page/game", {"spec" : data, "userName" : req.session.userName});
    });
};
