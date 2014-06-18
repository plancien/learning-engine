define([], function(){
    "use strict";
    
    function Player(x,y) {
        this.reset(x,y);
    }

    Player.prototype.reset = function(x,y) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.linkTo = null;
        this.dir = 1;
    };

    Player.prototype.update = function(dt,gravity) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        var fx = 0;
        var fy = gravity;
        
        if (this.linkTo) {
            var ropeVector = {
                x:this.linkTo.x-this.x,
                y:this.linkTo.y-this.y
            };
            var length = Math.sqrt(ropeVector.x*ropeVector.x+ropeVector.y*ropeVector.y);
            if (length > this.linkTo.ropeRadius) {
                var forceRope = (length - this.linkTo.ropeRadius) * 0.00001;
                var forceRopeVector = {
                    x: ropeVector.x * forceRope / length,
                    y: ropeVector.y * forceRope / length
                };
                fx += forceRopeVector.x;
                fy += forceRopeVector.y;
            }
        }
        
        this.vx += fx * dt;
        this.vy += fy * dt;
    };

    Player.prototype.isOutsideOfScreen = function(scrolling) {
        return (this.y > scrolling+700);
    };

    Player.prototype.tryToLink = function(anchor,config) {
        var dis = {
            x:anchor.x-this.x,
            y:anchor.y-this.y
        };
        var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
        if (length < config.maxRopeDistance+10 && anchor.good) {
            this.linkTo = anchor;
            this.linkTo.ropeRadius = length * 0.4;
            return;
        } else {
            this.linkTo = null;
        }
    };


    return Player;
});