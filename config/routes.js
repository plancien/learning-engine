var img = require(__dirname+"/../server/img.js");
var passport = require('passport');
var users = require(__dirname+"/../server/users.js");

module.exports = function(app) {

    app.get('/test', function(req, res) {
        res.send('Server is ok !');
    });

    app.get('/', function(req, res) {
        req.originalUrl
        if (req.user) {
            res.render('index.html',{userName: req.user});
        } 
        else if (req.param("session")){
            if (req.param("pseudo")){
                var userName = req.param("pseudo");
            }
            else{
                var userName = "invite";
            }
            res.render('index.html',{userName: userName});
        }
        else {
            res.redirect('/login');
        }
        
    });
    users.registerUserRoute(app);

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });

    app.post("/upload",function(req,res) {
        var fs = require('fs');
        img.save(req.files.uploadedImage,function(err,data) {
            //Ici on rajoute dans le fchier .json du client l'url de la nouvelle image
            users.addImage(data.url, req.user);
            res.redirect("/");
        });
        /*
        // if(req.files.uploadedImage.size){//verify image size
            fs.readFile(req.files.uploadedImage.path, function (err, data) {
                var newPath = "./public/images/"+req.files.uploadedImage.name;
                fs.writeFile(newPath, data, function (err) {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    res.redirect("/")
                });
            });
        //}
        */

    });
};
