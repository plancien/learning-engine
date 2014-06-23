var img = require(__dirname+"/../server/img.js");


module.exports = function(app) {

    app.get('/test', function(req, res) {
        res.send('Server is ok !');
    });

    app.get('/', function(req, res) {
        res.render('index.html');
    });
    app.get('/inscription', function(req, res) {
        res.render('inscription.html');
    });
    app.get('/acceptInscription', function(req, res) {
        res.render('acceptInscription.js');
    });


    app.post("/upload",function(req,res) {
        var fs = require('fs');
        img.save(req.files.uploadedImage,function(err,data) {
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
