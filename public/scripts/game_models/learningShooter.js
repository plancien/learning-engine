/*

@name 
    Learning shooter
@endName

@description
    Move with Q and D, shoot with space.
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/window_size',
    'modules/score',
    'modules/frames',
    'modules/key_listener',
    'modules/render',
    'modules/tools',
    'modules/mouse',
    'modules/particle_generator',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function (eventBus, canvasCreate, windowSize, score, frames, keyListener, Render, tools, mouse, particles) {

    return function(params)
    {
    	var canvas,
    	ctx = "";
    	var img = new Image();
    	img.src = "./images/GDP2.png";

    	var callBonuses = 0;
    	var paramsCanvas = {
				id: "learningShooter",
				width: 800,
				height: 800
			};

        var mousePos = {
            x : 0,
            y : 0,
            isClicking : {}
        }

    	var gameContainer = {
    		paddle : {},
    		answer : {},
    		key : "",
    		arrayArrows : [],
            arrayAnswer : [],
    		ilBouge : {},
    		imageGood : new Image(),
    		imageBad :  new Image()
    	};

	    eventBus.on('init', function () {
            particles();
            eventBus.emit('need new bonus');
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

/***************************************************************************************
* MAIN LOOP
***************************************************************************************/
		eventBus.on("new frame", function(){
		  		ctx.fillStyle = "black";
		  		ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
			   	//Rendering and moving the paddle
			   	gameContainer.paddle.update();
                colliderObject(); 
                
                callBonuses++;
                if(callBonuses%180 === 0)
                {  
                    createAnswers();
                }

                for(var j = 0; j < gameContainer.arrayAnswer.length; j++)
                {
                    gameContainer.arrayAnswer[j].update();
                    if( gameContainer.arrayAnswer[j].y > 800)
                    {
                       gameContainer.arrayAnswer.splice(j, 1);
                    }

                }


			   	for(var i =0 ; i < gameContainer.arrayArrows.length; i++)
			   	{	
                    gameContainer.arrayArrows[i].update();

			   		if(gameContainer.arrayArrows[i].y < 0)
			   			gameContainer.arrayArrows.splice(i, 1);
			   	}
			});


/***************************************************************************************
* CREATING THE PATTERN FOR THE ANSWERS
***************************************************************************************/
        function createAnswers()
        {
            var paramsAnswer = {
                    x : Math.round(Math.random()*700), 
                    y : Math.round(Math.random()*100),
                    width : 80,
                    height : 80,
                    speed : Math.round(Math.random()*3)+1,
                    answer : "good"
                }
                    gameContainer.imageGood.src = params.bonusUrl;
                    gameContainer.answer = new FallingAnswer(paramsAnswer);
                    eventBus.emit('init render', {object : gameContainer.answer,
                          sprite : {x : 0, y : 0, width : 96, height : 96, img : gameContainer.imageGood}
                 })
                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
                createBadAnswer();
        }

        function createBadAnswer()
        {
                var paramsBadAnswer = {
                    x : Math.round(Math.random()*700), 
                    y : Math.round(Math.random()*100),
                    width : 80,
                    height : 80,
                    speed : Math.round(Math.random()*3)+1,
                    answer : "bad"
                }

                 gameContainer.imageBad.src = params.malusUrl;
                    gameContainer.answer = new FallingAnswer(paramsBadAnswer);
                    eventBus.emit('init render', {object : gameContainer.answer,
                          sprite : {x : 0, y : 0, width : 96, height : 96, img : gameContainer.imageBad}
                 })

                 var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
        }

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

/***************************************************************************************
* Bonus/malus falling from the "sky"
***************************************************************************************/

		var FallingAnswer = function FallingAnswer(params)
		{
			this.x = params.x;
	    	this.y = params.y;
	    	this.rotation = Math.random()*4;
	    	this.radius = params.height/2;
	    	this.width = this.radius;
	    	this.height = this.radius;
	    	this.speed = params.speed;
	    	this.image = gameContainer.imageGood;


	    	this.render = function render()
	    	{
	    	}

	    	this.move = function move()
	    	{
	    		this.y += this.speed;
	    	}

			this.update = function update()
			{
                this.move();
                eventBus.emit('render object', this, ctx);
			}
		}
/***************************************************************************************
* Bonus/malus falling from the "sky"
***************************************************************************************/       


    function colliderObject()
    { 
        for(var i = 0; i < gameContainer.arrayAnswer.length; i++)
        {       
            if(gameContainer.arrayAnswer[i] != undefined){
                var distance = tools.vectors.getDistance(gameContainer.arrayAnswer[i], mousePos);
                 
                if(distance < 80 && mousePos.isClicking.left){
                    gameContainer.arrayAnswer.splice(i, 1);
                     eventBus.emit('CreateParticles', mousePos.x, mousePos.y, "white", 40, 60);
                }
            }
        }
    }
     eventBus.on('mouse update', function(data)
        {
           mousePos.x = data.x;
           mousePos.y = data.y;
           mousePos.isClicking = data.isClicking;
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
