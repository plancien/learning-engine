define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine'
], function(eventBus, heroEngine, collisionEngine) {
    var pikachu = function(){
        this.pikaSpriteConfig = {};
        this.pikaSpriteConfig.idle = {"width" : 36, "height" :38, "nbAnim" : 1, "loop" : -1, "fps" : 3, "offsetY" : 64};
        this.pikaSpriteConfig.idle2 = {"width" : 36, "height" :38, "nbAnim" : 1, "loop" : -1, "fps" : 3, "offsetY" : 320};
        this.pikaSpriteConfig.runLeft = {"width" : 56, "height" : 30, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 32};
        this.pikaSpriteConfig.runRight = {"width" : 56, "height" : 28, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 0};
        this.pikaSpriteConfig.runLeftReverse = {"width" : 55, "height" : 34, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 255};
        this.pikaSpriteConfig.runRightReverse = {"width" : 55, "height" : 34, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 289};
        this.pikaSpriteConfig.idleLeftReverse={"width" : 46, "height" : 40, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 359};
        this.pikaSpriteConfig.idleRightReverse={"width" : 46, "height" : 40, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 401};

        var inputsPika = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
        var configPika = { "x" : 1200, "y" : 1100, "maxSpeed" : 30, "acceleration" : 4, "deceleration" : 2, "color" : "rgba(0,200,255,1)", "width" : 39, "height" : 41, "inputs" : inputsPika};
       
        this.pikachu = heroEngine.create(configPika, true, true);
        collisionEngine.addElement(this.pikachu, "pikachu");
        this.pikachu.collisionCallBack = {};
        this.pikachu.collisionCallback["wall"] = function(opponent){
            if (this.pikachu.x + this.pikachu.width > opponent.x && this.pikachu.x < opponent.x)
                this.pikachu.x = opponent.x - this.pikachu.width;
            else if (this.pikachu.x < opponent.x + opponent.width && this.pikachu.x + this.pikachu.width > opponent.x + opponent.width)
                this.pikachu.x = opponent.x + opponent.width;
            else if (this.pikachu.y > opponent.y){
                this.pikachu.y = opponent.y + opponent.height;
                    if(!this.pikachu.desaccrochage){
                        this.pikachu.accrochage= true;
                    }
                 if(this.pikachu.currentAnim=="runLeft"){
                    this.pikachu.speedY=-5;
                    this.pikachu.changeAnimation("runLeftReverse");
                    
                 }
                 else if(this.pikachu.currentAnim=="runRight"){
                    this.pikachu.speedY=-5;
                    this.pikachu.changeAnimation("runRightReverse");
                    
                 }
            }
            else{
                 this.pikachu.desaccrochage=false;
                 this.pikachu.accrochage= false;
                 this.pikachu.y = opponent.y - this.pikachu.height; 
                
            }
        }
    }

    return new pikachu;
});