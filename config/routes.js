var img = require(__dirname + "/../server/img.js");
var passport = require('passport');
var users = require(__dirname + "/../server/users.js");

module.exports = function(app) {

    app.get('/test', function(req, res) {
        res.send('Server is ok !');
    });

    app.get('/', function(req, res) {
        req.session.origin = req.originalUrl;
        if (req.user) {
            res.render('index.html', {
                userName: req.user
            });
        } else if (req.param("session")) {
            res.render('index.html', {
                userName: req.param("pseudo") ? req.param("pseudo") : "invite"
            });
        } else {
            res.redirect('/login');
        }
    });

    app.get("/redirect", function(req, res) {
        if (req.session.origin) {
            res.redirect(req.session.origin);
            req.session.origin = "";
        } else {
            res.redirect('/');
        }
    });

    users.registerUserRoute(app);

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post("/upload", function(req, res) {
        var fs = require('fs');
        img.save(req.files.uploadedImage, function(err, data) {
            users.addImage(data.url, req.user);
            res.redirect("/");
        });
    });
};
