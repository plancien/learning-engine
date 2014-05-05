define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine'
], function(eventBus, heroEngine, collisionEngine) {
    var Pikachu = function(){
        var that = this;

            //Initialisation des donnees de notre hero
        var inputsPika = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
        var configPika = { "x" : 1200, "y" : 1100, "maxSpeed" : 30, "acceleration" : 4, "deceleration" : 2, "color" : "rgba(0,200,255,1)", "width" : 39, "height" : 41, "inputs" : inputsPika};
        this.pikachu = heroEngine.create(configPika, true, true);
        this.pikachu.haveJump = false;
        this.pikachu.sens = "Right";
        this.pikachu.heightJump = 10;
        this.pikachu.frameForWaitingAnimation = 60;
        this.pikachu.currentFrameWaiting = 0;

        collisionEngine.addElement(this.pikachu, "pikachu");                //On rajoute notre hero dans le moteur de collision dans le groupe cree dans l'init
        this.pikachu.collisionCallBack = {};
        this.pikachu.collisionCallback["wall"] = function(opponent){
            if (that.pikachu.x + that.pikachu.width > opponent.x && that.pikachu.x < opponent.x)        //Si collision par la droite
                that.pikachu.x = opponent.x - that.pikachu.width;
            else if (that.pikachu.x < opponent.x + opponent.width && that.pikachu.x + that.pikachu.width > opponent.x + opponent.width)     //Si collision par la gauche
                that.pikachu.x = opponent.x + opponent.width;
            else if (that.pikachu.y > opponent.y){              //Si collision par le haut
                that.pikachu.y = opponent.y + opponent.height;
                that.pikachu.speedY = -11;
            }
            else{                                               //Sinon collision par le bas
                that.pikachu.y = opponent.y - that.pikachu.height; 
                that.pikachu.haveJump = false;
            }
        }
        

        eventBus.on("key pressed Z", function(){ 
            if (!that.pikachu.haveJump){
                that.pikachu.speedY = -that.pikachu.heightJump;
                that.pikachu.haveJump = true;
            }
        });
        eventBus.on("key pressed S", function(){ 
            that.pikachu.speedY += 11;
        });



        this.pikachu.run = function(){
            // if (this.speedY > 0)
                // var first = "jump";
            if (this.speedX == 0){
                this.currentFrameWaiting++;
                var first = (this.currentFrameWaiting >= this.frameForWaitingAnimation) ? "waiting" : "idle";
            }
            else {
                this.currentFrameWaiting = 0;
                var first = "run";
                this.sens = (this.speedX > 0) ? "Left" : "Right";
            }

            var third = (this.speedY > 0) ? "" : "Reverse";

            var animationName = first + this.sens + third;

            if (this.currentAnim != animationName)
                this.changeAnimation(animationName);
        }
    }

    return new Pikachu();
});