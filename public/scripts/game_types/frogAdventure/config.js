define([], function(){
	var config = {};

	config.bonus = {}
	config.bonus.size = 50;

	config.hero = {};
	config.hero.x = 1200;
	config.hero.y = 1100;
	config.hero.speedX = 0;
	config.hero.speedY = 0;
	config.hero.friction = 0.9;
	config.hero.acceleration = 2.4;
	config.hero.color = "rgba(0,200,255,1)";
	config.hero.width = 39;
	config.hero.height = 41;
	config.hero.canJump = false;
	config.hero.nbFrameJump = 10;
	config.hero.currentJumpFrame = 10;
	config.hero.pxJump = 3;
	config.hero.currentFrameWaiting = 0;
	config.hero.sens = "Right"

	config.heroInput = {};
	config.heroInput.left = "left";
	config.heroInput.right = "right";
	config.heroInput.up = "up";
	config.heroInput.down = "down";

    config.heroSprite = {};
    config.heroSprite.idleLeft = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288};
    config.heroSprite.idleRight = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "scaleX" : -1, "scaleY" : 1};
    config.heroSprite.idleLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "scaleX" : 1, "scaleY" : -1};
    config.heroSprite.idleRightReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "rotation" : Math.PI};
    config.heroSprite.runLeft = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0};
    config.heroSprite.runRight = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : -1, "scaleY" : 1};
    config.heroSprite.runLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : 1, "scaleY" : -1};
    config.heroSprite.runRightReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "rotation" : Math.PI};
    config.heroSprite.jumpLeft = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256};
    config.heroSprite.jumpRight = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "scaleX" : -1, "scaleY" : 1};
    config.heroSprite.jumpLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "scaleX" : 1, "scaleY" : -1};
    config.heroSprite.jumpRightReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "rotation" : Math.PI};
    config.heroSprite.waitingLeft = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
    config.heroSprite.waitingRight = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "scaleX" : -1, "scaleY" : 1, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
    config.heroSprite.waitingLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "scaleX" : 1, "scaleY" : -1, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
    config.heroSprite.waitingRightReverse = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "rotation" : Math.PI, "loopCallback" : function (target){target.currentFrameWaiting = 0}};


	return config;
});    	