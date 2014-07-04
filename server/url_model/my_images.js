var pageManager = require(__path.controller+"/pageManager");
var users = require(__path.model+"/users");
var img = require(__path.model+"/img");

module.exports = function(){
    pageManager.add("my_images",
    function(req, res){         //get
        if (userName = req.session.userName){
        	var imagesList = users.getUserImageSync(userName);
        	this.display(req, res, "my_images", imagesList);
        }
        else{
			res.redirect("login");
        }
    },
    
    function(req, res){         //post
        if (req.session.userName){
            img.save(req.files.uploadedImage, function(err, data) {
                users.addImage(data.url, req.session.userName);
                res.redirect("/my_images");
            });
        }
        else{
            res;redirect("login");
        }
    });
};