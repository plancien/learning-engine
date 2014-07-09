
var games = require(__path.model+"/game");
var img = require(__path.model+"/img");
var users = require(__path.model+"/users");


module.exports.getDefaultAndUserGame = function(userName, callback){
    games.getDefaultGame(function(defaultFiles){
        users.getListGame(userName, function(list){
            games.exportListGame(list, function(userFiles){
                callback(defaultFiles.concat(userFiles));
            });
        });
    });
};

module.exports.getUserGame = function(userName, callback){
    users.getListGame(userName, function(list){
        games.exportListGame(list, function(userFiles){
            callback(userFiles);
        });
    });
};

module.exports.getCreateGameInfos = function(userName, callback){
    img.getDefaultUrl(function(err,imgs) {
        var spec = {};
        spec.imagesList = imgs;
        spec.userImagesList = users.getUserImageSync(userName);
        spec.gameList = games.getGamesList();
        callback(spec)
    });
}

