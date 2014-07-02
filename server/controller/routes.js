
var pageManager = require(__dirname + "/pageManager");
var fs = require('fs');
var url = require('url');

module.exports = function(app) {



    // app.get('/', function(req, res) {
    //     res.redirect("/home");
    // }); 

    app.use(function(req, res, next){
        if (req){
            var tabPath = url.parse(req.url).pathname;
            tabPath = tabPath.split("/");
            tabPath.splice(0, 1);
            pageManager.request(tabPath, req.method.toLowerCase(), req, res, tabPath);
        }
        else
            next();
    });



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
