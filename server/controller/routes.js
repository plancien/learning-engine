
var pageManager = require(__dirname + "/pageManager")
// var querystring = require('querystring');

var fs = require('fs');
var url  =require('url');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.redirect("/home")
        // redirectAccordingToSession(req, res);
    });

    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

    app.post("/upload", function(req, res) {
        addImage(req, res);
    });
    
    app.get('/:page', function(req, res){
        var pathName = url.parse(req.url).pathname;
        pageManager.request(pathName, "get", req, res);
    });
    app.post('/:page', function(req, res){
        var pathName = url.parse(req.url).pathname;
        pageManager.request(pathName, "post", req, res);
    });



};

function addImage(req, res){
    img.save(req.files.uploadedImage, function(err, data) {
        users.addImage(data.url, req.user);
        res.redirect("/");
    });
}

function sendGame(req, res){

}
