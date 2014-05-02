define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/mouse',
    'modules/moveToTarget'
], function(eventBus, Canvas, frames, mouse, moveToTarget) {

	var canvas = Canvas.create({"width":480,"height":270});
	var context = canvas.context;

	function Carre (x,y,w,h,color) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = w || 1;
		this.height  = h || 1;
		this.color = color || "#FAA";
	}
	Carre.prototype.draw = function(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,this.width,this.height);
	}
	Carre.prototype.moveTo = moveToTarget;

	function Target () {
		this.x = 100;
		this.y = 100;
	}

	var target = new Target();
	var carre = new Carre(50,50,50,50,"#6A6");

	eventBus.on('mouse update', function (mouse) {
		target.x = mouse.x;
		target.y = mouse.y; 
	})
	eventBus.on('new frame',function () {
		context.fillStyle = "#000";
		context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
		carre.moveTo(target,10,0,true);
		carre.draw(context);

	})

});
