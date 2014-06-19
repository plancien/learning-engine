define(['event_bus'], function(eventBus) {
    var GravityEngine = function(){}
    GravityEngine.prototype.acceleration = 0.4;
    GravityEngine.prototype.maxSpeed = 10;
    GravityEngine.prototype.content = [];

    GravityEngine.prototype.addElement = function(target){
        if (!target.speedY)
            target.speedY = 0;
        if (!target.y)
            console.warn("Vous allez utiliser la graviter sur " + target + ", il ne possede pas de y");
        this.content.push(target);
    }
    GravityEngine.prototype.calcul = function(){
        for (var i = this.content.length - 1; i >= 0; i--) {
            if (this.content[i].noGravity){ //Si on a demande de ne plus etre affecte par la gravite
                return false;               
            }
            this.content[i].speedY += this.acceleration;
            if (this.content[i].speedY > this.maxSpeed)
                this.content[i].speedY = this.maxSpeed;
            this.content[i].y += this.content[i].speedY;
        };
    }
    GravityEngine.prototype.init = function(acceleration, maxSpeed){
        this.maxSpeed = maxSpeed;
        this.acceleration = acceleration;
    }
    return new GravityEngine();
});