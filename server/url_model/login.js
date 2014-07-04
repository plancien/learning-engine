var pageManager = require(__path.controller+"/pageManager");
var users = require(__path.model+"/users");

module.exports = function(){
    var that = this;
    pageManager.add("login",
    function(req, res){         //get
        if (req.session.userName)
            res.redirect("/home");
        else
            this.display(req, res, "login");
    },
    function(req, res){         //post
        users.log(req, function(successful){
            if (successful){
                req.session.userName = req.body.username;
                res.redirect("/home");
            }
            else{
                res.redirect("/login");
            }
        });
    });
}