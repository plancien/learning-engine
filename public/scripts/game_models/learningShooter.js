/*

@name 
    Learning shooter
@endName

@description
    Move with the arrows, and shoot with the up-arrow to touch the right bonuses and avoid the malus
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/window_size',
    'modules/score',
    'modules/frames',
    'modules/mouse',
], function (eventBus, canvasCreate, windowSize, score, frames, mouse) {

    return function(params)
    {
    	var canvas,
    	ctx = "";


    	var paramsCanvas = {
				id: "learningShooter",
				width: 800,
				height: 800
			};

    	var gameContainer = {
    		paddle : ""
    	}

	    eventBus.on('init', function () {

			canvas = canvasCreate.create(paramsCanvas);
			ctx = canvas.contxt;

		    ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
		    ctx.fillStyle = "#000000";

		    var paramsPaddle = {
		    	x : 10, 
		    	y : 10,
		    	width : 200,
		    	height : 200
		    }

		    gameContainer.paddle = new Paddle(paramsPaddle);
	  	});



	  	eventBus.on("new frame", function(){

			ctx.fillStyle = "#00FF00";
	  		ctx.clearRect(0, 0, paramsCanvas.width, params.height);

		   	//Rendering and moving the paddle
		   	gameContainer.paddle.draw();
		   	gameContainer.paddle.move();
		});

		eventBus.on('mouse update', function(mouseMove)
		{
			
		});


	    var Paddle = function(params)
	    {
	    	this.x = params.x;
	    	this.y = params.y;
	    	this.height = params.height;
	    	this.width = params.width;

	    	this.draw = function()
	    	{
	    		ctx.beginPath();
			    ctx.rect(this.x, this.y, this.width, this.height);
			    ctx.fillStyle = "#00FF00";
			    ctx.fill();
			    ctx.closePath();
	    	}	

	    	this.move = function()
	    	{
	    		this.x++;
	    		this.y++;
	    	}

	    	this.update = function()
	    	{
	    		this.move();
	    		this.draw();
	    	}
	    }

	};
});
