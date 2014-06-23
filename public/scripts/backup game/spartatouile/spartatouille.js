define([
    'event_bus',
    'modules/canvas',
    'modules/imageLoader'
], function(eventBus, canvasCreate, imageLoader) {
	return function(params) {
		var container;
		var canvas = canvasCreate.create({width:800, height:475, id:"canvas"});
        var context = canvas.context;
        var player = new Player();
        var enemys = [];
        var princesses = [];
        var score = 0;
        var collision = false;
        var lifes = [];
        var die = false;

        for (var i = 0; i < 10; i++) {
			enemys.push(new Enemy(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
		}

		for (var i = 0; i < 3; i++) {
			princesses.push(new Princess(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
		}

		for (var i = 0; i < 3; i++) {
			lifes.push(new Life(29 * i, 30));
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

			for(var i = 0; i < lifes.length; i++) {
				lifes[i].drawLife(context);
			}

			for (var i = 0; i < enemys.length; i++) {
		    	collisionElements(player, enemys[i]);

		    	if (collision) {
		    		enemys.splice(i, 1);
		    		lifes.pop();
			    	score -= 8;
		    	}
		    }

		    for (var i = 0; i < princesses.length; i++) {
		    	collisionElements(player, princesses[i]);

		    	if (collision) {
		    		princesses.splice(i, 1);
			    	score += 3;
		    	}
		    }

		    if (princesses.length <= 0) {
		    	for (var j = 0; j < 3; j++) {
					princesses.push(new Princess(-50 - Math.random() *- 50, Math.random() * canvas.canvas.width));
				}
		    }

		    if (lifes <= 0) {
		    	die = true;
		    }

			scoreUser(context);

			if (die == false) {
				requestAnimationFrame(gameLoop);
			}

			if (die) {
			    context.font = "50pt Calibri,Geneva,Arial";
	    		context.strokeStyle = "rgb(0,0,0)";
			    context.strokeText("GAME OVER", canvas.canvas.width * .5 - 150, canvas.canvas.height * .5);
			}
        }

        function Player() {
			this.image = imageLoader("Spartiate.png");
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
					if (this.x >= 0) {
						this.x -= this.speed;
						this.frameHeight = 133;

						if (this.animFrame % 9 == 0) {
							this.frameWidth += 66.7;
							if (this.frameWidth >= 252) {
								this.frameWidth = 0;
							}
						}
					} else {
						this.x = 0;
					}
				}
			};

			object.prototype.moveRight = function() {
				if (this.right) {

					if (this.x <= canvas.canvas.width - 66) {
						this.x += this.speed;
						this.frameHeight = 67;

						if (this.animFrame % 9 == 0) {
							this.frameWidth += 64.7;
							if (this.frameWidth >= 252) {
								this.frameWidth = 0;
							}
						}
					} else {
						this.x = canvas.canvas.width - 66;
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
			this.speed = 2.3;
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

		function scoreUser(ctx) {
			ctx.font = "20pt Calibri,Geneva,Arial";
    		ctx.strokeStyle = "rgb(0,0,0)";
		    ctx.strokeText("SCORE : " + score, 0, 20);
		}

		function collisionElements(element1, element2) {
			if (element1.x + 66 > element2.x
				&& element1.x < element2.x + 50
				&& element1.y + 66 > element2.y
				&& element1.y < element2.y + 50) {

					collision = true;
			} else {
				collision = false;
			}
		}

		function Life(x, y) {
			this.image = imageLoader("Coeur.png", "games_images");
			this.x = x;
			this.y = y;
		}

		Life.prototype.drawLife = function(ctx) {
			ctx.drawImage(this.image, this.x, this.y);
		};
	}
});