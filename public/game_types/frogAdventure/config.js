define([], function(){

    bonus = {
        size : 65
    };

    hud = {
        imageSize : 40,
        animateFlySpeed : 20
    };

    level = {
        startX : 10000,
        startY : 10000,
        doorHeight : 120,
        containerWallSize : 300,
    }

    gravity = { 
        acceleration : 1,
        maxSpeed : 15
    };

    load = {
        nbLevel : 4
    };

    hero = {
        x : 1200,
        y : 200,
        speedX : 0,
        speedY : 0,
        friction : 0.8,
        acceleration : 4,
        color : "rgba(0,200,255,1)",
        width : 39,
        height : 41,
        canJump : false,
        nbFrameJump : 10,
        currentJumpFrame : 10,
        pxJump : 3,
        currentFrameWaiting : 0,
        sens : "Right"
    };

    heroInput = {
        left : "left",
        right : "right",
        up : "up",
        down : "down"
    };

    heroHitbox = {
        "shape" : "rect",
        "width" : 24,
        "height" : 32,
        "offsetY" : 0,
        "offsetX" : 4
    };

    heroSprite = {  
        idleLeft :          {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0},  
        idleRight :         {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : -1,  "scaleY" : 1}, 
        idleLeftReverse :   {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : 1,   "scaleY" : -1},    
        idleRightReverse :  {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "rotation" : Math.PI}, 
        runLeft :           {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 32},    
        runRight :          {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 64}, 
        runRightReverse :   {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 64,  "scaleX" : 1,   "scaleY" : -1},    
        runLeftReverse :    {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 64,  "rotation" : Math.PI}, 
        jump :              {"width" : 32,   "height" :32,   "nbAnim" : 4,   "loop" : 1,     "fps" : 3,     "offsetY" : 0,  "offsetX" : 0,    "loopCallback" : function (target){target.currentAnim = "idleLeft"}},   
        inAirRight :        {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 5,  "offsetY" : 32},    
        inAirLeft :         {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 5,  "offsetY" : 64}, 

    };
    collectibleSprite = {
        idle : {"width" : 32,   "height" :32,   "nbAnim" : 8,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0},  
    }

    hero.width = 39;
    hero.height = 41;

    return {    
        "bonus"     : bonus,
        "gravity"   : gravity,
        "hero"      : hero,
        "heroInput" : heroInput,
        "heroSprite": heroSprite,
        "level"     : level,
        "hud"       : hud,
        "heroHitbox": heroHitbox,
        "collectibleSprite" : collectibleSprite
    }
});     