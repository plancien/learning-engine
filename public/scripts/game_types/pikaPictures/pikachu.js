define([
    'event_bus',
    'modules/squareHero',
], function(eventBus, heroEngine) {
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
       
        game.pikachu = heroEngine.create(configPika, game.canvas.context, true);
        collisionEngine.addElement(game.pikachu, "pikachu");
        game.pikachu.collisionCallBack = {};
        game.pikachu.collisionCallback["wall"] = function(opponent){
            if (game.pikachu.x + game.pikachu.width > opponent.x && game.pikachu.x < opponent.x)
                game.pikachu.x = opponent.x - game.pikachu.width;
            else if (game.pikachu.x < opponent.x + opponent.width && game.pikachu.x + game.pikachu.width > opponent.x + opponent.width)
                game.pikachu.x = opponent.x + opponent.width;
            else if (game.pikachu.y > opponent.y){
                game.pikachu.y = opponent.y + opponent.height;
                    if(!game.pikachu.desaccrochage){
                        game.pikachu.accrochage= true;
                    }
                 if(game.pikachu.currentAnim=="runLeft"){
                    game.pikachu.speedY=-5;
                    game.pikachu.changeAnimation("runLeftReverse");
                    
                 }
                 else if(game.pikachu.currentAnim=="runRight"){
                    game.pikachu.speedY=-5;
                    game.pikachu.changeAnimation("runRightReverse");
                    
                 }
            }
            else{
                 game.pikachu.desaccrochage=false;
                 game.pikachu.accrochage= false;
                 game.pikachu.y = opponent.y - game.pikachu.height; 
                
            }
        }
    }

    return new pikachu;
});