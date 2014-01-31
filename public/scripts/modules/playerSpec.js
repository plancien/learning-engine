define(['event_bus'], function(eventBus) {

    var players = [];

    function Player(params) {
        this.x = params.x;
        this.y = params.y;
        this.width = params.width || 10;
        this.height = params.height || 10;
        this.speed = params.speed;
        this.color = params.color;
        this.contour = params.contour;
    }

    Player.prototype.move = function() {
        if (this.gauche) {
            this.x -= this.speed;
        }
        if (this.droite) {
            this.x += this.speed;
        }
        if (this.haut) {
            this.y -= this.speed;
        }
        if (this.bas) {
            this.y += this.speed;
        }
        if (this.espace) {
            missiles.push(new Missile(this.x, this.y));
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > 465) {
            this.x = 465;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > 465) {
            this.y = 465;
        }
    };

    Player.prototype.draw = function() {
        canvasManager.context.fillStyle = this.color;
        canvasManager.context.fillRect(this.x, this.y, this.width, this.height);
        canvasManager.context.strokeStyle = this.contour;
        canvasManager.context.strokeRect(this.x, this.y, this.width, this.height);
    };

    function initPlayers() {
        var joueur = new Player({
            x: Math.random() * canvasManager.width - 1,
            y: Math.random() * canvasManager.height,
            width: 35,
            height: 35,
            speed: 5,
            color: "white",
            contour: "black"
        });

        players.push(joueur);
    }

    eventBus.on('init', function(params) {
        eventBus.emit('Top', playerSpec);
    });

});
