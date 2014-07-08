define(["game_types/spider_game/config", "modules/collisions"], function(config, collisions){
    "use strict";
    
    function Level(bonusImgName,malusImgName) {
        this.bonusImgName = bonusImgName;
        this.malusImgName = malusImgName;
        this.anchors = []
    }

    Level.prototype.createAnchor = function(y, good, imgs) {
        var table = good ? this.bonusImgName : this.malusImgName;
        var anchor = {
            x:Math.random()*(config.canvasWidth-config.size_img)+config.size_img/2,
            y:y || Math.random()*600,
            radius: config.size_img*0.5,
            good: good,
            img: imgs[table[(table.length*Math.random())|0]]
        };
        for (var i = this.anchors.length - 1; i >= 0; i--) {
            if (collisions.circles(anchor, this.anchors[i])){
                this.createAnchor(y, good, imgs);
                return false;
            }
        };
        this.anchors.push(anchor);
        return anchor;
    };

    Level.prototype.generate = function(imgs) {
        this.anchors = [];
        for (var i = 0; i < 10000; i+=config.stepBetweenAnchors) {
            this.createAnchor(-200-i+Math.random()*50,false,imgs);
            this.createAnchor(-200-i+Math.random()*50,true,imgs);
        };
    };

    Level.prototype.reset = function() {
        this.generate();
    };


    return Level
});