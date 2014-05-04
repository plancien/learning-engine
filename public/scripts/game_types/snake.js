define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'event_capabilities',
], function(eventBus, Canvas, Frames, addEventCapabilities) {
    var game = {};
    
    var canvas = Canvas.create({"width" : 800, "height" : 600});
    game.tileSize =32;
    game.canvas = canvas.canvas;
    game.context = canvas.context;
    console.log(game.canvas)
    game.context.fillStyle = "rgb(0,0,0)";
    game.context.fillRect(0,0, 800, 600); 
    game.snake = new Snake(100, 100, game);
    addEventCapabilities(game);
    game.on('move snake', function(e){
        game.snake.move(e); // C'est ici le PB  ? yes !
    });
    window.onkeydown = function(e){
        console.log(e);
        switch(e.keyCode){
            case 38 : 
            game.emit('move snake',"up");
            break;
            case 40 : 
            game.emit('move snake',"down");
            break;
            case 39 :
            game.emit('move snake','right');
            break;
            case 37 : 
            game.emit('move snake',"left");
            break;
        }
    };
    console.log(game.snake)
    eventBus.on("new frame",function(){run(game)})
    // grille(game);
});
function Snake(x,y,game){
    this.refGame = game;
    this.pos={
        x:0,
        y:0,
    }
    this.moveDelay= 30;
    this.x = this.pos.x*game.tileSize;
    this.y = this.pos.y*game.tileSize;
    this.width = game.tileSize;
    this.height = game.tileSize;
    this.size = 4;
    this.input="left";
    this.move = function move(args){
        switch(args){
            case 'up':
            this.input="up";
            break;
            case 'down':
            this.input="down";
            break;
            case 'left':
            this.input="left";
            break;
            case 'right':
            this.input="right";
            break;
        } 
    };
    this.update=function update(){
        this.moveDelay--;
        this.x = this.pos.x*game.tileSize;
        this.y = this.pos.y*game.tileSize;
        switch (this.input){
            case "right":
            if(this.moveDelay==0){
                this.pos.x ++;
                this.moveDelay=30;   
            }
            break;
            case "left":
            if(this.moveDelay==0){
                this.pos.x --;
                this.moveDelay=30; 
            }
            break;
            case "up":
            if(this.moveDelay==0){
                this.pos.y --;
                this.moveDelay=30;
            }
            break;
            case "down":
            if(this.moveDelay==0){
                this.pos.y ++;
                this.moveDelay=30;
            }
            break;
        }
    }
};

function run(game){
    game.context.fillStyle="black";
    game.context.fillRect(0,0,game.canvas.width,game.canvas.height);
    console.log(game.snake.input);
    game.snake.update();
    draw(game);
}
function draw(game){
  game.snake.display();  
}
    
Snake.prototype.display = function() {
    this.refGame.context.fillStyle = "red";
    this.refGame.context.fillRect(this.x, this.y, this.width, this.height);
    
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
