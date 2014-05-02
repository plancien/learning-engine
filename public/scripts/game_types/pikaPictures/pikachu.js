define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine'
], function(eventBus, heroEngine, collisionEngine) {
    var Pikachu = function(){
        this.pikaSpriteConfig = {};
        this.pikaSpriteConfig.idle = {"width" : 32, "height" :32, "nbAnim" : 4, "loop" : -1, "fps" : 3, "offsetY" : 0};
        this.pikaSpriteConfig.idle2 = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 3, "offsetY" : 0};
        this.pikaSpriteConfig.runLeft = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0};
        this.pikaSpriteConfig.runRight = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : -1, "scaleY" : 1};
        this.pikaSpriteConfig.runLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : 1, "scaleY" : -1};
        this.pikaSpriteConfig.runRightReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "rotation" : Math.PI};
        this.pikaSpriteConfig.idleLeftReverse={"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0};
        this.pikaSpriteConfig.idleRightReverse={"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0};

        var inputsPika = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
        var configPika = { "x" : 1200, "y" : 1100, "maxSpeed" : 30, "acceleration" : 4, "deceleration" : 2, "color" : "rgba(0,200,255,1)", "width" : 39, "height" : 41, "inputs" : inputsPika};
       
        this.pikachu = heroEngine.create(configPika, true, true);
        collisionEngine.addElement(this.pikachu, "pikachu");
        this.pikachu.collisionCallBack = {};
        var that = this;
        this.pikachu.collisionCallback["wall"] = function(opponent){
            if (that.pikachu.x + that.pikachu.width > opponent.x && that.pikachu.x < opponent.x)
                that.pikachu.x = opponent.x - that.pikachu.width;
            else if (that.pikachu.x < opponent.x + opponent.width && that.pikachu.x + that.pikachu.width > opponent.x + opponent.width)
                that.pikachu.x = opponent.x + opponent.width;
            else if (that.pikachu.y > opponent.y){
                that.pikachu.y = opponent.y + opponent.height;
                    if(!that.pikachu.desaccrochage){
                        that.pikachu.accrochage= true;
                    }
                 if(that.pikachu.currentAnim=="runLeft"){
                    that.pikachu.speedY=-5;
                    that.pikachu.changeAnimation("runLeftReverse");
                    
                 }
                 else if(that.pikachu.currentAnim=="runRight"){
                    that.pikachu.speedY=-5;
                    that.pikachu.changeAnimation("runRightReverse");
                    
                 }
            }
            else{
                 that.pikachu.desaccrochage=false;
                 that.pikachu.accrochage= false;
                 that.pikachu.y = opponent.y - that.pikachu.height; 
                
            }
        }

        // if(this.pikachu.speedX==0){
        //     this.pikachu.canIdle=true;
        // }
        //     if((this.pikachu.currentAnim!="idle"||this.pikachu.currentAnim!="idleRightReverse")&&this.pikachu.canIdle){
        //         if(this.pikachu.accrochage){
        //             this.pikachu.changeAnimation("idleRightReverse");
        //         }
        //         // else{
        //         //     this.pikachu.changeAnimation("idle2");
        //         // }
        // }
        // if(this.pikachu.accrochage){
        //      this.pikachu.speedY=-5;
        // }
    }

    return new Pikachu();
});