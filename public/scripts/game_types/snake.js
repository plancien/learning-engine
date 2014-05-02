define([
    'event_bus',
    'modules/canvas',
], function(eventBus, Canvas) {
	var game = {};
	var canvas = Canvas.create({"width" : 800, "height" : 600});
	game.canvas = canvas.canvas;
	game.context = canvas.context;
	console.log(game.canvas)
	game.context.fillStyle = "rgb(0,0,0)";
	game.context.fillRect(0,0, 800, 600); 
	alert("hello world");
	game.snake = new Snake(100, 100, game);
	game.snake.display();
	console.log(game.snake)
	// grille(game);
});
function Snake(x,y,game){
	this.refGame = game;
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.size = 4;
    move:function move(args){
                console.log(this);
                switch(args){
                    case 'up':
                    this.y--;
                    break;
                    case 'down':
                    this.y++;
                    break;
                    case 'gauche':
                    this.x-=40;
                    break;
                    case 'droite':
                    this.x++;
                    break;
                } 
            }
        }
    };
    addEventCapabilities(game.player);
    game.player.on('move',function(e){
        console.log("loooool",this)
        this.move(e);
    });
    addEventCapabilities(game);
Snake.prototype.display = function() {
	this.refGame.context.fillStyle = "white";
	this.refGame.context.fillRect(this.x, this.y, this.x+this.width, this.y+this.height);
	
}
function grille(game){
	var carre = {}
    	carre.height = 20;
    	carre.width  = 20;
    var maxX = (game.canvas.width/carre.height + carre.width);
    var maxY = (game.canvas.height/carre.height + carre.width);
    game.context.fillStyle = 'white';
     for(var iX = 0; iX < maxX; iX++){
        for(var iY = 0; iY < maxY; iY++){

            //Dessiner ---------
            game.context.lineTo(0, iY * game.canvas.width);
            //Dessiner | | | | |
            game.context.lineTo(0, iX * game.canvas.height);
        }
    }
}
