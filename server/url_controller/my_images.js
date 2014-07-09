
var display = require(__dirname + "/../controller/defaultDisplay.js");
var mamm = require(__path.model+"/multiple_action_model_manageur");
var users = require(__path.model+"/users");
var img = require(__path.model+"/img");


function createSpec(userName, error){
    return {
        "imagesList" : users.getUserImageSync(userName),
        "error" : error
    }
}


module.exports = {
    "get" : function(req, res){
        if (userName = req.session.userName){
            var imagesList = users.getUserImageSync(userName);
            display(req, res, "my_images", createSpec(userName, ""));
        }
        else{
            res.redirect("login");
        }
    },
    
    "post" : function(req, res){
        if (req.session.userName){
            img.save(req.files.uploadedImage, function(err, data) {
                if (err){
                    display(req, res, "my_images", createSpec(userName, err));
                }
                else{
                    users.addImage(data.url, req.session.userName);
                    res.redirect("/my_images");
                }
            });
        }
        else{
            res.redirect("login");
        }
    },

    "removed" : function (req, res){
        var userName = req.session.userName;
        var imageName = req.params.imageName;

        if (userName){
            mamm.userHasImage(userName, imageName, function(have){
                if (have){
                    img.removeUploadedImage(imageName, function(err){
                        var pathImage = "/images/uploaded_images/"+imageName;
                        users.removeImage(userName, pathImage, function(err){
                            res.redirect("/my_images");
                        });
                    });
                }
                else{
                    display(req, res, "my_images", createSpec(userName, "Cette image n'existe pas"));
                }
            });
        }
        else{
            res.redirect("/login");
        }
    }

};
