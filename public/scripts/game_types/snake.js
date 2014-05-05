define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/collisions',
    'event_capabilities',
], function(eventBus, Canvas, Frames,collisions,addEventCapabilities) {
    var game = {};
    
    var canvas = Canvas.create({"width" : 24*32, "height" : 24*32});
    game.tileSize =32;
    game.canvas = canvas.canvas;
    game.context = canvas.context;
    console.log(game.canvas);
    game.context.fillStyle = "rgb(0,0,0)";
    game.context.fillRect(0,0, 800, 600); 
    game.snake = new Snake(game);
    game.item= new Item(game);
    game.tails=[];
    addEventCapabilities(game);
    game.on('move snake', function(e){
        game.snake.move(e); // C'est ici le PB  ? yes !
    });
    window.onkeydown = function(e){
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
function Snake(game){
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
    this.input="right";
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
//------------------------SNAKE TAIL------------------------
function Tail(game,x,y){
    this.refGame=game;
    this.x=x;
    this.y=y;
    this.width=game.tileSize;
    this.height=game.tileSize;
    this.draw=function draw(){
        this.refGame.context.fillStyle = "green";
        this.refGame.context.fillRect(this.refGame.snake.x-32, this.refGame.snake.y-32, this.width, this.height);
    }
}
//-------------------------ITEM---------------------------------
function Item(game){
    this.refGame=game;
    this.x = (Math.random()*24|0)*game.tileSize;
    this.y = (Math.random()*24|0)*game.tileSize;
    this.height=game.tileSize;
    this.width=game.tileSize;
    this.draw = function draw(){
        this.refGame.context.fillStyle = "blue";
        this.refGame.context.fillRect(this.x, this.y, this.width, this.height);    
    }
}
//--------------------RUN-----------------------------------------
function run(game){
    game.context.fillStyle="black";
    game.context.fillRect(0,0,game.canvas.width,game.canvas.height);
    game.snake.update();
    manageItem(game);
    draw(game);
}
//------------------DRAW-----------------------------------------
function draw(game){
    game.item.draw();
    game.snake.draw();
    console.log(game.tails.length)
    for(var i=0;i<game.tails.length;i++){
        game.tails[i].draw()
        console.log("ca dessine")
    }  
}
//----------------------------------------------------------------
function manageItem(game){
    if(collisionSquares(game.snake,game.item)){
        game.item.x = (Math.random()*24|0)*game.tileSize;
        game.item.y = (Math.random()*24|0)*game.tileSize;
        game.tails.push(new Tail(game,game.snake.x,game.snake.y))
        console.log(game.tails)
    }
}

function collisionSquares(object1, object2){
    if 
    (
        (object1.x < (object2.x + object2.width)) && 
        ((object1.x + object1.width) > object2.x) && 
        (object1.y < (object2.y + object2.height)) && 
        ((object1.y + object1.height) > object2.y)
    ){
        return true;    
    }
    else{
        return false;
    }
        
}
