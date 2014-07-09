
var display = require(__dirname + "/../controller/defaultDisplay.js");

module.exports = function(req, res){
	display(req, res, "does_not_exist");
}
