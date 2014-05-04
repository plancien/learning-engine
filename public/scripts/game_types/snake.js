define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'event_capabilities',
], function(eventBus, Canvas, Frames, addEventCapabilities) {
    var game = {};
    
    var canvas = Canvas.create({"width" : 24*32, "height" : 24*32});
    game.tileSize =32;
    game.canvas = canvas.canvas;
    game.context = canvas.context;
    console.log(game.canvas);
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

//----------------------SNAKE---------------
function Snake(x,y,game){
    this.refGame = game;
    this.pos={
        x:0,
        y:0,
    }
    this.moveDelay= 5;
    this.delay=0;
    this.graphDir={x:0,y:0};
    this.x = 0;
    this.y = 0;
    this.width = game.tileSize;
    this.height = game.tileSize;
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
    this.checkDir=function checkDir(dirX,dirY){
        if(this.delay >= this.moveDelay){
            this.graphDir.y = dirY; //la direction de l'animation
            this.graphDir.x = dirX; //la direction de l'animation
            this.delay=0;   
        }
    };
    this.update=function update(){
        this.delay++;
        this.x += this.graphDir.x * (game.tileSize/this.moveDelay);
        this.y += this.graphDir.y * (game.tileSize/this.moveDelay);
        switch (this.input){
            case "right":
                this.checkDir(1,0);
            break;
            case "left":
                this.checkDir(-1,0);    
            break;
            case "up":
                this.checkDir(0,-1);    
            
            break;
            case "down":
                this.checkDir(0,1);   
            break;
        }
    }
};
Snake.prototype.draw = function() {
    this.refGame.context.fillStyle = "red";
    this.refGame.context.fillRect(this.x, this.y, this.width, this.height);
    
}
//--------------------RUN-----------------------------------------
function run(game){
    game.context.fillStyle="black";
    game.context.fillRect(0,0,game.canvas.width,game.canvas.height);
    console.log(game.snake.input);
    game.snake.update();
    draw(game);
}
//------------------DRAW-----------------------------------------
function draw(game){
  game.snake.draw();  
}
//----------------------------------------------------------------

