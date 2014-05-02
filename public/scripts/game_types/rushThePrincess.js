define([
    'event_bus',
    'modules/canvas',
], function(eventBus, canvasCreate) {
	return function(params) {
		var container;
		var canvas = canvasCreate.create({width:800, height:600, id:"canvas"});
        var context = canvas.context;
        var player = new Player();

        eventBus.on('init', function(_container) {
            container = _container;
            gameLoop();
        });

        function gameLoop() {
        	context.fillStyle = "#FFF";
            context.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

            player.drawPlayer(context);

        	requestAnimationFrame(gameLoop);
            //eventBus.emit('need new bonus');
        }

        function Player() {
			/*this.image = new Image();
			this.image.src = src;*/
			this.x = 50;
			this.y = 50;
			this.left = false;
			this.right = false;
			this.speed = 5;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.animFrame = 0;
		}

		Player.prototype.drawPlayer = function(ctx) {
			//this.animFrame ++;
			ctx.fillRect(20, 20, 50, 50);
			//ctx.drawImage(this.image,  this.frameWidth, this.frameHeight, 50, 60, this.x, this.y, 50, 60);
		};
	}
});