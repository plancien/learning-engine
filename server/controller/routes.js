
var img = require(__path.model + "/img.js");
var users = require(__path.model + "/users.js");
var fs = require('fs');

module.exports = function(app) {

    app.get('/', function(req, res) {
        redirectAccordingToSession(req, res);
    });

    app.get("/redirect", function(req, res) {
        res.redirect('/');
    });

    app.get('/login',function(req,res) {
        display(req, res, "login");
    });
    app.post('/login', function (req, res){
        checkLog(req, res, "login");
    });
    app.post('/signup',function(req,res) {
        checkSignUp(req, res);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post("/upload", function(req, res) {
        addImage(req, res);
    });
};

function display(req, res, page){
    var data = {
        page : page || "home",
        userName : req.session.userName || false
    };
    res.render("index.html", data);
}

function redirectAccordingToSession(req, res){
    if (req.session.userName) {
        display(req, res);
    }
    else if (req.query.session){
        display(req, res);
    }
    else{
        res.redirect("/login");
    }
}

function checkLog(req, res){
    users.log(req, function(successful){
        if (successful){
            req.session.userName = req.body.username;
            res.redirect("/");
        }
        else{
            display(req, res);
        }
    });
}

function checkSignUp(req, res){
    users.save(req.body.username,req.body.password,function(err) {
        if (err) {
            res.send("Error : " + err.message);
        } else {
            res.redirect("/login");
        }
    });
}

function addImage(req, res){
    img.save(req.files.uploadedImage, function(err, data) {
        users.addImage(data.url, req.user);
        res.redirect("/");
    });
}
