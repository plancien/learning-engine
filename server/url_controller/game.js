
var display = require(__dirname + "/../controller/defaultDisplay.js");
var games = require(__path.model+"/game");

module.exports = function(req, res){
	var gameName = req.params.gameName;

    games.get(gameName, function(data){
        display(req, res, "game", data);
    });
};
