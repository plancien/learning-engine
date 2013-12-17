define(['event_bus','modules/frames'], function(eventBus){

	var particleTable = [];
	var context = null;

	eventBus.on('newCanvas', function(canvas){
		context = canvas.context;
	});

	var Particle = function(x, y, color, canvasWidth) {
		this.x = x;
		this.y = y;
		var disapear = 0;
		var fix=5;
		var change=disapear;
		this.speed = 4;
		this.angle = Math.random() *Math.PI *2;
		this.color = color;

		this.move = function() {
			//mouvements aleatoirs en angle
			this.x += Math.cos(this.angle)* this.speed;
			this.y -= Math.sin(this.angle)* this.speed;
			disapear =-1;
			change=disapear;
		}
		this.draw = function() {	
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, 5 + change , 5 + change);
		}
	}

	eventBus.on('new frame', function(){
		for (var i = 0; i < particleTable.length ; i++)
	    {
	        particleTable[i].move();
	        particleTable[i].draw();
	    }
	});

	eventBus.on('CreateParticles', function(x, y, color, count){
		for (var i = 0; i < count; i++)
		{
			var star = new Particle(x, y, color);
			particleTable.push(star);
		}
	});
});