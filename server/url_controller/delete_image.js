
var display = require(__dirname + "/../controller/defaultDisplay.js");
var users = require(__path.model+"/users");
var img = require(__path.model+"/img");

module.exports = function (req, res){
    if (userName = req.session.userName){
        img.removeUploadedImage(req.params.imageName, function(err){
        	var pathImage = "/images/uploaded_images/"+req.params.imageName;
            users.removeImage(userName, pathImage, function(err){
                res.redirect("/my_images");
            });
        });

    }
    else{
        res.redirect("login");
    }
};
