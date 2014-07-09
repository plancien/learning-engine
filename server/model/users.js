
var fs = require('fs');

module.exports.log = function (req, callback){
    if (req.body.username){
        findUser(req.body.username, function(mdp){
            if (mdp == req.body.password){
                callback(true);
            }
            else{
                callback(false);
            }
        });
    }
    else{
        callback(false);
    };
};

module.exports.removeImage = function(userName, imageName, callback){
    getDataUser(userName, function(err, data){
        if (err){
            callback();
        }
        else{
            for (var i = data.img.length - 1; i >= 0; i--) {
                if (data.img[i] == imageName){
                    data.img.splice(i, 1);
                }
            };
            fs.writeFile(getPathUser(userName), JSON.stringify(data, null, 4), callback);
        }
    });
};

module.exports.save = function(name,password,callback) {
    var file = __path.bdd + "/userList.json";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return;
        }
     
        data = JSON.parse(data);

        if (data[name]){
            return callback(new Error("username allready exist"));
        } else {
            data[name] = password;
            fs.writeFile(file,JSON.stringify(data,null,4),function(){
                var userFile = {
                    "img" : [],
                    "game" : []
                };

                pathUser = __path.bdd + "/user/"+name+".json";
                fs.writeFile(pathUser, JSON.stringify(userFile, null, 4), callback);
            });
        }
    }); 
};

module.exports.getListGame = function(userName, callback){
    fs.readFile(getPathUser(userName), 'utf8', function (err, data) {
        if (err) throw err;  
        var file = JSON.parse(data);
        callback(file.game);
    });    
};

module.exports.addGame = function(userName, gameName, callback){
    fs.readFile(getPathUser(userName), function(err, files){
        if (err) throw err;
        var files = JSON.parse(files);
        files.game.push(gameName);

        fs.writeFile(getPathUser(userName), JSON.stringify(files), callback);
    });
};

module.exports.haveGame = function(userName, gameName, callback){
    this.getListGame(userName, function(data){
        for (var i = data.length - 1; i >= 0; i--) {
            if (data[i] == gameName){
                return callback(true);
            }
        };
        return callback(false);
    });
};

module.exports.deleteGame = function(userName, gameName, callback){
    getDataUser(userName, function(err, data){
        for (var i = data.game.length - 1; i >= 0; i--) {
            if (data.game[i] == gameName){
                data.game.splice(i,1);
            }
        };
        saveDataUser(userName, JSON.stringify(data), callback);
    });
};

function findUser(name, callback){
    var file = __path.bdd + "/userList.json";
    fs.exists(file, function (exists) {
        if (exists){
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    return;
                }
             
                data = JSON.parse(data);
                if (data[name]){
                    return callback(data[name]);
                }
                else{
                    return callback(false);
                }
            });
        }
        else{
            return callback(false);
        }
    });
}

function getUserImageSync(name) {
    var file = __path.bdd + "/user/"+name+".json";
    var data = fs.readFileSync(file);
    var user = JSON.parse(data);
    return user.img;
}

function addImage(imageName, userName, callback){
    fs.readFile(getPathUser(userName), 'utf8', function (err, data) {
        var file = JSON.parse(data);
        file.img.push(imageName);
        fs.writeFile(getPathUser(userName), JSON.stringify(file, null, 4), callback);
    });
}
function addSessionGame(userName, gameName){
        
    fs.readFile(getPathUser(userName), 'utf8', function (err, data) {
        var file = JSON.parse(data);
        file.game.push(gameName);
        this.saveDataUser(userName, JSON.stringify(file, null, 4));
    });

}


function getDataUser(userName, callback){
    var userPath = getPathUser(userName);
    fs.exists(userPath, function(exists){
        if (exists){
            fs.readFile(getPathUser(userName), 'utf8', function (err, data) {
                if (err) return callback(err);
                callback(null, JSON.parse(data));
            });
        }
        else{
            callback(true, null);
        }
    });
}

function saveDataUser(userName, data, callback){
    fs.writeFile(getPathUser(userName), data, callback);
}

function getPathUser (userName){
    return __path.bdd + "/user/"+userName+".json";
}

module.exports.addImage = addImage;
module.exports.getUserImageSync = getUserImageSync;
module.exports.addSessionGame = addSessionGame;
