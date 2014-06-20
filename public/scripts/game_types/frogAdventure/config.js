define([], function(){

	bonus = {
		size : 50
	};

	hud = {
		imageSize : 40,
		animateFlySpeed : 20
	};

	level = {
		startX : 1000,
		startY : 1000,
		doorHeight : 120,
		containerWallSize : 300,
	}

	gravity = {	
		acceleration : 1,
		maxSpeed : 30
	};

	load = {
		nbLevel : 2
	};

	hero = {
		x : 1200,
		y : 200,
		speedX : 0,
		speedY : 0,
		friction : 0.9,
		acceleration : 2.4,
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

    heroSprite = {	
    	idleLeft : 			{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 288},	
        idleRight : 		{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 288,	 "scaleX" : -1,	 "scaleY" : 1},	
        idleLeftReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 288,	 "scaleX" : 1,	 "scaleY" : -1},	
        idleRightReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 288,	 "rotation" : Math.PI},	
        runLeft : 			{"width" : 32,	 "height" :32,	 "nbAnim" : 8,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0},	
        runRight : 			{"width" : 32,	 "height" :32,	 "nbAnim" : 8,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "scaleX" : -1,	 "scaleY" : 1},	
        runLeftReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 8,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "scaleX" : 1,	 "scaleY" : -1},	
        runRightReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 8,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "rotation" : Math.PI},	
        jumpLeft : 			{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 256},	
        jumpRight : 		{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 256,	 "scaleX" : -1,	 "scaleY" : 1},	
        jumpLeftReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 256,	 "scaleX" : 1,	 "scaleY" : -1},	
        jumpRightReverse : 	{"width" : 32,	 "height" :32,	 "nbAnim" : 1,	 "loop" : -1,	 "fps" : 5,	 "offsetY" : 0,	 "offsetX" : 256,	 "rotation" : Math.PI},	
        waitingLeft : 		{"width" : 32,	 "height" :32,	 "nbAnim" : 5,	 "loop" : 1,	 "fps" : 3,	 "offsetY" : 0,	 "offsetX" : 288,	 "loopCallback" : function (target){target.currentFrameWaiting = 0}},	
        waitingRight : 		{"width" : 32,	 "height" :32,	 "nbAnim" : 5,	 "loop" : 1,	 "fps" : 3,	 "offsetY" : 0,	 "offsetX" : 288,	 "scaleX" : -1,	 "scaleY" : 1,	 "loopCallback" : function (target){target.currentFrameWaiting = 0}},	
        waitingLeftReverse :{"width" : 32,	 "height" :32,	 "nbAnim" : 5,	 "loop" : 1,	 "fps" : 3,	 "offsetY" : 0,	 "offsetX" : 288,	 "scaleX" : 1,	 "scaleY" : -1,	 "loopCallback" : function (target){target.currentFrameWaiting = 0}},	
        waitingRightReverse:{"width" : 32,	 "height" :32,	 "nbAnim" : 5,	 "loop" : 1,	 "fps" : 3,	 "offsetY" : 0,	 "offsetX" : 288,	 "rotation" : Math.PI,	 "loopCallback" : function (target){target.currentFrameWaiting = 0}}
    };


	return {	
		"bonus" 	: bonus,
		"gravity" 	: gravity,
		"hero" 		: hero,
		"heroInput" : heroInput,
		"heroSprite": heroSprite,
		"level" 	: level,
		"hud"		: hud
	}
});    	