define([
    'event_bus',
    'modules/canvas',
], function(eventBus, canvasCreate) {
	return function(params) {
		var container;
		var canvas = canvasCreate.create({width:800, height:475, id:"canvas"});
        var context = canvas.context;
        var player = new Player();
        var enemys = [];
        var princesses = [];

        for (var i = 0; i < 10; i++) {
			enemys.push(new Enemy(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
		}

		for (var i = 0; i < 3; i++) {
			princesses.push(new Princess(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
		}

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

			for(var i = 0; i < enemys.length; i++) {
				enemys[i].drawEnemy(context);
				enemys[i].moveEnemy();
				if (enemys[i].y > canvas.canvas.height) {
					enemys.splice(i, 1);
				}

				if (enemys.length <= 0) {
					for (var j = 0; j < 10; j++) {
						enemys.push(new Enemy(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
					}
				}
			}

			for(var i = 0; i < princesses.length; i++) {
				princesses[i].drawPrincess(context);
				princesses[i].movePrincess();
				if (princesses[i].y > canvas.canvas.height) {
					princesses.splice(i, 1);
				}

				if (princesses.length <= 0) {
					for (var j = 0; j < 3; j++) {
						princesses.push(new Princess(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
					}
				}
			}

        	requestAnimationFrame(gameLoop);
        	console.log(params.bonusUrl);
        }

        function Player() {
			this.image = new Image();
			this.image.src = "../../images/Spartiate.png";
			this.x = 50;
			this.y = 400;
			this.left = false;
			this.right = false;
			this.speed = 8;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.animFrame = 0;
		}

		Player.prototype.drawPlayer = function(ctx) {
			this.animFrame ++;
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
						this.frameWidth += 64.7;
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

		function Enemy(y, x) {
			this.image = new Image();
			this.image.src = params.malusUrl;
			this.x = x;
			this.y = y;
			this.speed = 2.2;
		}

		Enemy.prototype.drawEnemy = function(ctx) {
			ctx.drawImage(this.image, this.x, this.y, 50, 50);
		};

		Enemy.prototype.moveEnemy = function() {
			this.y += this.speed;
		};

		function Princess(y, x) {
			this.image = new Image();
			this.image.src = params.bonusUrl;
			this.x = x;
			this.y = y;
			this.speed = 1;
		}

		Princess.prototype.drawPrincess = function(ctx) {
			ctx.drawImage(this.image, this.x, this.y, 50, 50);
		};

		Princess.prototype.movePrincess = function() {
			this.y += this.speed;
		};
	}
});