
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

module.exports.exportListGame = function(list, callback){
    var response = [];
    for (var i = list.length - 1; i >= 0; i--) {
        var path = __path.bdd + "/session_game/" + list[i] + ".json";
        response.push(
            JSON.parse(
                fs.readFileSync(path)
            )
        );
    };
    callback(response);
};

module.exports.addGame = function(data, callback) {  //add a game in bdd and callback the name
    console.log(data);
        
    var name = generateRandomName();
    data.name = name;
    var gameFile = JSON.stringify(data);
    var path = __path.bdd+"/session_game/"+name+".json";
    fs.writeFile(path, gameFile, callback(data));
};

module.exports.getGamesList = function() {
    path = __path.bdd + "/game_types/";
    
    var allFiles = fs.readdirSync(path);
    var games = [];
    
    for (var i = 0; i < allFiles.length; i++) {
        var game = JSON.parse( fs.readFileSync(path+allFiles[i]) );
        game.id = allFiles[i].replace(".json", "");
        games.push(game);
    }
    return games;
};


module.exports.get = function(name, callback){
    var sessionPath = __path.bdd+"/session_game/"+name+".json";

    fs.exists(sessionPath, function(exists){
        var realPath = (exists) ? sessionPath : __path.bdd+"/default_game/"+name+".json";

        fs.readFile(realPath, function(err, files){
            if (err) throw err;
            var gameData = JSON.parse(files);
            addUrl(gameData, function(fullGameInfo){
                callback(fullGameInfo);
            });
        });
    });
};

function addUrl(gameData, callback){
    fs.readFile(__path.bdd + "/game_types/" + gameData.game + ".json", function(err, files){
        if (err) throw err;
        gameData.url = JSON.parse(files).url;
        callback(gameData);
    });
}


function generateRandomName() {
    return ("abcdefghijklmnopqrstuvwxyz123456789").split("").sort(function() {
        return Math.random()-0.5;
    }).slice(0,10).join("");
}

function getGameInfo (directoryPath) {
    return JSON.parse(fs.readFileSync(directoryPath+"/game.json"));
};

