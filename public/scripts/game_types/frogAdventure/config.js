define([], function(){

    bonus = {
        size : 50
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
        maxSpeed : 30
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
        acceleration : 5,
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
        "width" : 18,
        "height" : 32,
        "offsetY" : 0,
        "offsetX" : 7
    };

    heroSprite = {  
        idleLeft :          {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0},  
        idleRight :         {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : -1,  "scaleY" : 1}, 
        idleLeftReverse :   {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : 1,   "scaleY" : -1},    
        idleRightReverse :  {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "rotation" : Math.PI}, 
        runLeft :           {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 32},    
        runRight :          {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 1,  "offsetY" : 64}, 
        runLeftReverse :    {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 5,  "offsetY" : 64,  "scaleX" : 1,   "scaleY" : -1},    
        runRightReverse :   {"width" : 32,   "height" :32,   "nbAnim" : 9,   "loop" : -1,    "fps" : 5,  "offsetY" : 32,  "rotation" : Math.PI}, 
        jumpLeft :          {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0},  
        jumpRight :         {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : -1,  "scaleY" : 1}, 
        jumpLeftReverse :   {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "scaleX" : 1,   "scaleY" : -1},    
        jumpRightReverse :  {"width" : 32,   "height" :32,   "nbAnim" : 1,   "loop" : -1,    "fps" : 5,  "offsetY" : 0,  "offsetX" : 0,    "rotation" : Math.PI}, 
        waitingLeft :       {"width" : 32,   "height" :32,   "nbAnim" : 5,   "loop" : 1,     "fps" : 10,     "offsetY" : 0,  "offsetX" : 0,    "loopCallback" : function (target){target.currentFrameWaiting = 0}},   
        waitingRight :      {"width" : 32,   "height" :32,   "nbAnim" : 5,   "loop" : 1,     "fps" : 10,     "offsetY" : 0,  "offsetX" : 0,    "scaleX" : -1,  "scaleY" : 1,   "loopCallback" : function (target){target.currentFrameWaiting = 0}},   
        waitingLeftReverse :{"width" : 32,   "height" :32,   "nbAnim" : 5,   "loop" : 1,     "fps" : 10,     "offsetY" : 0,  "offsetX" : 0,    "scaleX" : 1,   "scaleY" : -1,  "loopCallback" : function (target){target.currentFrameWaiting = 0}},   
        waitingRightReverse:{"width" : 32,   "height" :32,   "nbAnim" : 5,   "loop" : 1,     "fps" : 10,     "offsetY" : 0,  "offsetX" : 0,    "rotation" : Math.PI,   "loopCallback" : function (target){target.currentFrameWaiting = 0}}
    };
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
        "heroHitbox": heroHitbox
    }
});     