define(['event_bus', 'modules/imageLoader', 'modules/collisions', 'game_types/theGreatRun/config', 'ext_libs/howler.min'], 
function(eventBus, imageLoader, collisions, config){
    var jump = new Howl({
        urls: ['sounds/TGR_jump.wav']
    });
    var stopWall = new Howl({
        urls: ['sounds/TGR_wallStop.wav']
    });

    
    function Player() {
        for (var key in config.player)
            this[key] = config.player[key];

        this.score = 0;
        this.rotation = 0;
        this.canMove = true;
        var movedDistance = 0;
        var moveDirection = {
            x: 0,
            y: 0
        };

        var that = this;
        eventBus.on("key pressed", function(keycode) {
            jump.play();
            if (!that.canMove) return;
            var x = 0;
            var y = 0;
            switch (keycode) {
            case "left":
                if (that.x - that.width <= 0) {
                    x = 0;
                    stopWall.play();
                } else {
                    x = -1;
                }
                that.rotation = Math.PI / 2;
                break;
            case "up":
                if (that.y - that.height <= 0) {
                    y = 0;
                    stopWall.play();
                } else {
                    y = -1;
                }
                that.rotation = Math.PI;
                break;
            case "right":
                if (that.x + that.width >= canvas.canvas.width) {
                    x = 0;
                    stopWall.play();
                } else {
                    x = 1;
                }
                that.rotation = -Math.PI / 2;
                break;
            case "down":
                if (that.y + that.height >= canvas.canvas.height) {
                    y = 0;
                    stopWall.play();
                } else {
                    y = 1;
                }
                that.rotation = 0;
                break;
            default:
                return;
                break;
            }
            canMove = false;
            moveDirection = {
                x: x,
                y: y
            };
            eventBus.emit("play animation", that, "jump");
        });

        eventBus.emit('init render', {
            object: this,
            sprite: {
                x: 0,
                y: 0,
                width: 25,
                height: 25,
                img: imageLoader("frog.png")
            },
            rotating: true
        });

        eventBus.emit("add animation", this, {
            name: "jump",
            sprites: [{
                x: 0,
                y: 0,
                width: 25,
                height: 25
            }, {
                x: 50,
                y: 0,
                width: 25,
                height: 25
            }, {
                x: 25,
                y: 0,
                width: 25,
                height: 25
            }]
        });

        Player.prototype.move = function() {
            if (Math.abs(movedDistance) >= this.width) {
                movedDistance = 0;
                this.canMove = true;
                moveDirection = {
                    x: 0,
                    y: 0
                };
            } else {
                this.x += moveDirection.x * this.speed;
                this.y += moveDirection.y * this.speed;
                movedDistance += moveDirection.x * this.speed + moveDirection.y * this.speed;
            }
        };

        Player.prototype.isInside = function(target){
        	this.hitbox.x = this.x + this.hitbox.offsetX;
        	this.hitbox.y = this.y + this.hitbox.offsetY;
        	return collisions.squares(this.hitbox, target);
        }
    }
    return Player;
});    	