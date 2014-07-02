
var PageManager = function(){
    this.page = {};
}
PageManager.prototype.request = function(pathName, method, req, res){
    var pageName = pathName.split("/")[1];
    if (this.page[pageName] && this.page[pageName][method]){
        this.page[pageName][method](req, res);
    }
    else{
        res.send("404");
    }
}
PageManager.prototype.add = function(pathName, getAction, postAction){
    if (this.page[pathName]){
        console.warn(pathName + " est déjà occupé");
    }
    else{
        this.page[pathName] = new Page(getAction, postAction);
        return this.page[pathName];
    }
}



function Page(getAction, postAction){
    this.get = getAction;
    if (postAction)
        this.post = postAction;
}
Page.prototype.post = function(req, res){
    res.send("Pas de methode post");
}
Page.prototype.display = function(req, res, page, spec){
    var data = {
        page : page || "welcome",
        userName : req.session.userName || false
    };

    if (spec){
        data.spec = spec;
    }
    res.render("index.html", data);
}

module.exports = new PageManager();

var fs = require('fs');

fs.readdir(__path.url_model, function(err, files){  //Vient faire un require sur tous le contenue de url_model
    if (err) throw err;
    for (var i = files.length - 1; i >= 0; i--) {
        require(__path.url_model+"/"+files[i])();
    };
});
