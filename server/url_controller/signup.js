
var users = require(__path.model+"/users");

module.exports = {
    "get" : function(req, res){             //get
        res.redirect("/login");
    },
    "post" : function(req, res){                //post
        users.save(req.body.username,req.body.password,function(err) {
            if (err) {
                res.send("Error : " + err.message);
            } else {
                res.redirect("/login");
            }
        });
    }   
};

