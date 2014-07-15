/************************************************************
*	Add a global object named __path.
*   Object in __path contain string to a folder
*	Or function whose init path for module
************************************************************/


var rootPath = require('path').join(__dirname, '../../');
var engine = require("ejs-locals");

module.exports = {
	"root" : rootPath,
	"bdd" : rootPath + "server/bdd",
	"model" : rootPath + "server/model",
	"gameTypes" : rootPath + "public/scripts/game_types/"
};

module.exports.initViews = function(app){
	app.engine('ejs', engine);
	app.set("views",__path.root+"/server/views");
	app.set("view engine", "ejs");
    // app.set('views', rootPath + '/server/views');
    // app.engine('.html', require('ejs').__express);
};
