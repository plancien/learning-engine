define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine'
], function(eventBus, heroEngine, collisionEngine) {
    var Pikachu = function(){
        var that = this;

            //Initialisation des donnees de notre hero
        var configPika = { "x" : 1200, "y" : 1100, "maxSpeed" : 30, "acceleration" : 4, "deceleration" : 2, "color" : "rgba(0,200,255,1)", "width" : 39, "height" : 41};
        this.pikachu = heroEngine.create(configPika, true, true);
        this.pikachu.haveJump = false;
        this.pikachu.sens = "Right";
        this.pikachu.heightJump = 10;
        this.pikachu.frameForWaitingAnimation = 60;
        this.pikachu.currentFrameWaiting = 0;
        this.pikachu.wallGrip = false;

        collisionEngine.addElement(this.pikachu, "pikachu");                //On rajoute notre hero dans le moteur de collision dans le groupe cree dans l'init
        this.pikachu.collisionCallBack = {};                                //On init l'objet pour les callback de collisions
        this.pikachu.collisionCallback["wall"] = function(wall){            // On attribue une fonction pour le callback avec les murs

            var leftIn = that.pikachu.x + that.pikachu.width - wall.x;
            var rightIn = wall.x + wall.width - that.pikachu.x;
            var vecX = (leftIn < rightIn) ? leftIn : rightIn;

            var topIn =  that.pikachu.y + that.pikachu.height - wall.y;
            var bottomIn = wall.y + wall.height - that.pikachu.y;
            var vecY = (topIn < bottomIn) ? topIn : bottomIn;

            if (vecX < vecY){                               //Si on doit expulser en x
                if (leftIn < rightIn )
                    that.pikachu.x -= vecX; 
                else
                    that.pikachu.x += vecX;
            }
            else{                                           //Sinon on expulse en y
                if (topIn < bottomIn){
                    that.pikachu.y -= vecY;
                    that.pikachu.haveJump = false;
                }
                else{
                    that.pikachu.y += vecY - 1;
                    that.pikachu.wallGrip = wall;
                    that.pikachu.noGravity = true;
                }
                that.speedY = 0;
            }
        }
        

        eventBus.on("key pressed up", function(){ 
            if (!that.pikachu.haveJump){
                that.pikachu.speedY = -that.pikachu.heightJump;
                that.pikachu.haveJump = true;
            }
        });
        eventBus.on("key pressed down", function(){ 
            that.pikachu.wallGrip = false;
            that.pikachu.noGravity = false;
            that.pikachu.speedY += 1;
        });



        this.pikachu.run = function(){
            /*
                Pour piocher la bonne animation, on la decoupe en first
            */
            if (this.wallGrip){
                if (collisionEngine.rectCollision(this, this.hitbox[0], this.wallGrip, this.wallGrip.hitbox[0])){
                    this.y = this.wallGrip.y + this.wallGrip.height - 1; //On rajoute un - 1 pour creer une collision sur la prochaine frame
                    this.speedY = 0;
                }
                else{
                    this.wallGrip = false;
                    this.noGravity = false;
                }
            }

            if (this.speedX == 0){
                this.currentFrameWaiting++;     //Quand il est a l'arret on attend pour lui faire jouer uen petite animation
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