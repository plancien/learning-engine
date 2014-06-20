var fs = require("fs");

function getGamesList(path) {
    path = path || __dirname +"/../public/scripts/game_types/"
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