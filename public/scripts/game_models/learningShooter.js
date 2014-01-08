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
    'modules/key_listener',
    'modules/render',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function (eventBus, canvasCreate, windowSize, score, frames, mouse,keyListener, Render) {

    return function(params)
    {
    	var canvas,
    	ctx = "";
    	var img = new Image();
    	img.src = "./images/GDP2.png";
    	

    	var paramsCanvas = {
				id: "learningShooter",
				width: 800,
				height: 800
			};

    	var gameContainer = {
    		paddle : "",
    		key : "",
    		arrayArrows : [],
    		ilBouge : {},
    		imageGood : new Image(),
    		imageBad :  new Image()
    	};

    	var images2 = {

    	};

	    eventBus.on('init', function () {
			canvas = canvasCreate.create(paramsCanvas);
			ctx = canvas.context;

		   ctx.fillStyle = "black";
		   ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);

		    var paramsPaddle = {
		    	x : 350, 
		    	y : 780,
		    	width : 100,
		    	height : 20,
		    	speed : 5,
		    	color : "rgb(255,255,255)"
		    }

		    gameContainer.paddle = new Paddle(paramsPaddle);	  	
		});


		eventBus.on("new frame", function(){
				eventBus.emit('need new bonus');
		  		ctx.fillStyle = "black";
		  		ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
			   	//Rendering and moving the paddle
			   	gameContainer.paddle.update();

			   	for(var i =0 ; i < gameContainer.arrayArrows.length; i++)
			   	{	
			   		gameContainer.arrayArrows[i].update();
			   		if(gameContainer.arrayArrows[i].y < 0)
			   		{
			   			gameContainer.arrayArrows.splice(i, 1);
			   		}
			   	}
			});

		eventBus.on('mouse update', function(mouseMove)
		{
			
		});


/***************************************************************************************
* PADDLE
***************************************************************************************/
	    var Paddle = function Paddle(params)
	    {
	    	this.f = 0
	    	this.x = params.x;
	    	this.y = params.y;
	    	this.height = params.height;
	    	this.width = params.width;
	    	this.speed = params.speed;
	    	this.color = params.color

	    	this.draw = function draw()
	    	{
	    		ctx.beginPath();
			    ctx.rect(this.x, this.y, this.width, this.height);
			    ctx.fillStyle = this.color;
			    ctx.fill();
			    ctx.closePath();
	    	}	

	    	this.inputs = function inputs()
	    	{
	    		this.f++;
	    		for(var i =0; i < gameContainer.key.length; i++)
	    		{
	    			if(this.x > 0)
	    			{
		    			if(gameContainer.key[i] == 81){
		    				this.moveLeft();
		    			}
		    		}

    				if(this.x < 700)
	    			{
		    			if(gameContainer.key[i] == 68){
		    				this.moveRight();
		    			}
		    		}

		    		if(gameContainer.key[i] == 32 && this.f%5 === 0){
		    			this.shoot();
		    		}

	    		}
	    	}

	    	this.moveLeft = function moveLeft()
	    	{
	    		this.x -= this.speed ;
	    	}

	    	this.moveRight = function moveRight()
	    	{
				this.x += this.speed;
	    	}


	    	this.shoot = function shoot()
	    	{
	    		params.x = this.x + (this.width/2);
	    		params.y = this.y;
	    		params.height = 80;
	    		params.width = 80;
	    		var arrow = new Arrow(params);
	    		var spritex = Math.round(Math.random()*9) * 48;
	    		var spritey = Math.round(Math.random()*3) * 62;
	    		eventBus.emit('init render', {object : arrow,
                                      		  sprite : {x : spritex, y : spritey, width : 48, height : 62, img : img},
                                      		  rotating : true
                                    		  } )
	    		var arrows = gameContainer.arrayArrows.push(arrow);
	    	}

	    	this.update = function update()
	    	{
	    		this.inputs();
	    		this.draw();
	    	}
	    }

/***************************************************************************************
* Arrow shooted from the paddle
***************************************************************************************/

	    var Arrow = function Arrow(params)
	    {
	    	this.x = params.x;
	    	this.y = params.y;
	    	this.rotation = Math.random()*4;
	    	this.radius = params.height/2;
	    	this.width = this.radius;
	    	this.height = this.radius;
	    	this.speed = params.speed;
	    	this.color = params.color;
	    	this.image = gameContainer.imageGood;

	    	this.move = function inputs()
	    	{
	    		this.y -= this.speed;
	    	}

	    	this.update = function update()
	    	{
	    		this.rotation+= 0.05;
	    		this.move();
	    		eventBus.emit('render object', this, ctx);
	    	}
	    }

		eventBus.on('add bonus', function (good, url) {
			gameContainer.imageGood.src = "./images/+.png";
		});

	   	eventBus.on('keys still pressed', function(data)
	   	{
	   	 	gameContainer.key = data;
	   	});

        var bonusPoints = params.bonusPoints || 1;
        var malusPoints = params.malusPoints || -3;

	   	eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true,  params.malusUrl);

	};
});
