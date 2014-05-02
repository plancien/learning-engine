define([
    'event_bus',
    'modules/canvas',
], function(eventBus, canvasCreate) {
	return function(params) {
		var container;
		var canvas = canvasCreate.create({width:800, height:600, id:"canvas"});
        var context = canvas.context;
        var player = new Player();
        events(Player);
        player.keyboardEvent();

        eventBus.on('init', function(_container) {
            container = _container;
            gameLoop();
        });

        function gameLoop() {
        	context.fillStyle = "#FFF";
            context.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

            player.drawPlayer(context);
            player.moveLeft();
			player.moveRight();

        	requestAnimationFrame(gameLoop);
            //eventBus.emit('need new bonus');
        }

        function Player() {
			this.image = new Image();
			this.image.src = "../../images/Spartiate.png";
			this.x = 50;
			this.y = 600 - 80;
			this.left = false;
			this.right = false;
			this.speed = 8;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.animFrame = 0;
		}

		Player.prototype.drawPlayer = function(ctx) {
			this.animFrame ++;
			//context.fillStyle = "#FF0000";
			//ctx.fillRect(this.x, this.y, 50, 50);
			ctx.drawImage(this.image,  this.frameWidth, this.frameHeight, 70, 66, this.x, this.y, 70, 66);
		};

		(function move(object) {
			object.prototype.moveLeft = function() {
				if (this.left) {
					this.x -= this.speed;
					this.frameHeight = 133;

					if (this.animFrame % 9 == 0) {
						this.frameWidth += 66.7;
						if (this.frameWidth >= 252) {
							this.frameWidth = 0;
						}
					}
				}
			};

			object.prototype.moveRight = function() {
				if (this.right) {
					this.x += this.speed;
					this.frameHeight = 67;

					if (this.animFrame % 9 == 0) {
						this.frameWidth += 64.5;
						if (this.frameWidth >= 252) {
							this.frameWidth = 0;
						}
					}
				}
			};
		})(Player);

		function events(object) {
			object.prototype.keyboardEvent = function() {
				var player = this;
				window.addEventListener("keydown", function(e) {
					switch(e.keyCode) {
						case 37 :
							player.left = true;
						break;

						case 39 :
							player.right = true;
						break;

						default: 
						break;
					}
				}, false);

				window.addEventListener("keyup", function(e) {
					switch(e.keyCode) {
						case 37 :
							player.left = false;
						break;

						case 39 :
							player.right = false;
						break;

						default: 
						break;
					}
				}, false);
			};
		}
	}
});