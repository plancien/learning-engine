var fs = require("fs");
var Promise = require("promise");
var mime = require("mime");
var path = require("path");
var acceptedType = ["image/png","image/jpeg","image/gif","image/bmp"];


module.exports.getDefaultUrl = function(callback){
    fs.readdir(__path.root+"/public/images/games_images/", function(err, files){
        for (var i = files.length - 1; i >= 0; i--) {
            files[i] = "/images/games_images/" + files[i];
        }
        callback(err, files);
    });
};

module.exports.removeUploadedImage = function(imageName, callback){
    var path = __path.root + "/public/images/uploaded_images/" + imageName;
    removeImage(path, callback);
};


module.exports.save = function(file,callback) {
    if (isImage(file.path) && file.size < 50000) {
        fs.readFile(file.path, function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            var newPath = "/images/uploaded_images/"+generateRandomName()+"."+getExtension(file.name);
            fs.writeFile(__dirname+"/../../public"+newPath, data, function (err) {
                if(err) {
                    callback(err);
                    return;
                }
                callback(null,createDataFromPath(newPath));
            });
        });
    }
    else{
        callback("Le fichier est trop gros ou n'est pas une image");
    }
};


function getGameImagesList(userImgs,callback) {
    var readDir = Promise.denodeify(fs.readdir);
    var defaultImgPromise = readDir(__dirname+"/../../public/images/games_images/");
    var uploadedImgPromise = readDir(__dirname+"/../../public/images/uploaded_images/");
    var allImagesPromise = Promise.all([defaultImgPromise,uploadedImgPromise]);
    allImagesPromise.then(function(result) {
        var defaultImg = result[0];
        var uploadedImg = result[1];
        return defaultImg.map(appendPath("/images/games_images/"))
            .concat(
                uploadedImg.map(appendPath("/images/uploaded_images/"))
                .filter(belongToUser(userImgs))
            )
            .filter(isImage);
    }).then(function(img) {
        return img.map(createDataFromPath);
    },function(err) {
        callback(err);
    }).then(function(img) {
        callback(null,img);
    },function(err) {
        callback(err);
    });
}

function belongToUser(userImgs) {
    return function(img) {
        return userImgs.indexOf(img)>=0;
    };
}

function isImage(fileName) {
    return acceptedType.indexOf(mime.lookup(fileName)) >= 0;
}

function appendPath(pathName) {
    return function(fileName) {
        return pathName+fileName;
    };
}

function createDataFromPath(pathName) {
    return {
        url: pathName,
        fileName: path.basename(pathName),
        name: path.basename(pathName,path.extname(pathName))
    };
}

function generateRandomName() {
    return ("abcdefghijklmnopqrstuvwxyz123456789").split("").sort(function() {
        return Math.random()-0.5;
    }).slice(0,15).join("");
}

function getExtension(name){
    var tabName = name.split(".");
    return tabName[tabName.length-1];
}

function removeImage(pathName, callback){
    fs.exists(pathName, function (exists) {

        if (exists){
            fs.unlink(pathName, function (err) {
                if (err) throw err;
                callback(err);
            });
        }
    });
};

module.exports.getGamesImages = getGameImagesList;
module.exports.isImage = isImage;
