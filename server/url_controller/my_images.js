
var display = require(__dirname + "/../controller/defaultDisplay.js");
var users = require(__path.model+"/users");
var img = require(__path.model+"/img");

module.exports = {
    "get" : function(req, res){
        if (userName = req.session.userName){
            var imagesList = users.getUserImageSync(userName);
            display(req, res, "my_images", imagesList);
        }
        else{
            res.redirect("login");
        }
    },
    
    "post" : function(req, res){
        if (req.session.userName){
            img.save(req.files.uploadedImage, function(err, data) {
                if (err){
                    res.send(err);
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
    }
};
