var fs = require("fs");
var Promise = require("promise");
var mime = require("mime");
var path = require("path");
var acceptedType = ["image/png","image/jpeg","image/gif","image/bmp"]

function getGameImagesList(callback) {
    var readDir = Promise.denodeify(fs.readdir);
    var defaultImgPromise = readDir(__dirname+"/../public/images/games_images/");
    var uploadedImgPromise = readDir(__dirname+"/../public/images/uploaded_images/");
    var allImagesPromise = Promise.all([defaultImgPromise,uploadedImgPromise]);
    allImagesPromise.then(function(result) {
        var defaultImg = result[0];
        var uploadedImg = result[1];
        return defaultImg.map(appendPath("/images/games_images/"))
            .concat(uploadedImg.map(appendPath("/images/uploaded_images/")))
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

function isImage(fileName) {
    return acceptedType.indexOf(mime.lookup(fileName)) >= 0;
}

function appendPath(pathName) {
    return function(fileName) {
        return pathName+fileName;
    }
}

function createDataFromPath(pathName) {
    return {
        url: pathName,
        fileName: path.basename(pathName),
        name: path.basename(pathName,path.extname(pathName))
    }
}

function saveImage(file,callback) {
    if (isImage(file.path)) {
        fs.readFile(file.path, function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            var newPath = "/images/uploaded_images/"+file.name;
            fs.writeFile(__dirname+"/../public"+newPath, data, function (err) {
                if(err) {
                    callback(err);
                    return;
                }
                callback(null,createDataFromPath(newPath))
            });
        });
    }
}

module.exports.getGamesImages = getGameImagesList;
module.exports.isImage = isImage;
module.exports.save = saveImage;