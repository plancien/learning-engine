var fs = require("fs");

module.exports.getDefaultGame = function(callback){
    var path = __path.bdd + "/default_game/";
    fs.readdir(path, function(err, files){
        if (err) throw err;

        var response = [];
        for (var i = files.length - 1; i >= 0; i--) {
            response.push(
                    JSON.parse(
                        fs.readFileSync(path+files[i])
                    )
            );
        };
        callback(response);
    });
};

function getGamesList() {   
    path = __path.gameTypes;
    var dir = fs.readdirSync(path);
    var games = [];

    for (var i = 0; i < dir.length; i++) {
        if (fs.lstatSync(path+dir[i]).isDirectory()) {
            if (fs.existsSync(path+dir[i]+"/game.json")) {
                games.push(getGameInfo(path+dir[i]));
            }

        }
        
    }

    return games;
}

function getGameInfo(directoryPath) {
    return JSON.parse(fs.readFileSync(directoryPath+"/game.json"));
}

module.exports.getGamesList = getGamesList;
module.exports.getGameInfo = getGameInfo;