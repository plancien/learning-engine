
var PageManager = function(){
    this.page = {};
    this.defaultPage = "home";
}
PageManager.prototype.request = function(pageName, method, req, res){
    if (!pageName[0])
        pageName[0] = this.defaultPage;
    var parsed = this.findTarget(pageName);
    if (parsed.target && parsed.target[method]){
        parsed.target[method](req, res, parsed.rest);
    }
    else{
        res.send("404");
    }
};
PageManager.prototype.findTarget = function(tabPath){   //Vient parcourir l'arborescence de this.page 
    var target = this.page;
    for (var i = 0; i < tabPath.length; i++) {          //Pour toutes l'arborescence demande 
        if (target[tabPath[i]]){                        //Si la cible chercheuse contient la suite de l'arbo
            target = target[tabPath[i]];                //On la stock
        }
        else{
            return {
                "target" : target,
                "rest" : tabPath.splice(i, tabPath.length)
            };
        }
    };
    return {
        "target" : target,
        "rest" : false
    };
}
PageManager.prototype.add = function(pathName, getAction, postAction){
    if (this.page[pathName]){
        console.warn(pathName + " est déjà occupé");
    }
    else{
        this.page[pathName] = new Page(getAction, postAction);
        return this.page[pathName];
    }
};
PageManager.prototype.addOn = function(who, name, getAction, postAction){
    if (this.page[who]){
        this.page[who][name] = new Page(getAction, postAction);
    }
    else
        console.error("Impossible de rajouter '" + name + "' sur '" + who + "'");
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
};

module.exports = new PageManager();

var fs = require('fs');

fs.readdir(__path.url_model, function(err, files){  //Vient faire un require sur tous le contenue de url_model
    if (err) throw err;
    for (var i = files.length - 1; i >= 0; i--) {
        require(__path.url_model+"/"+files[i])();
    };
});
