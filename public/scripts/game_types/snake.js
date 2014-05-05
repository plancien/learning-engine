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
    this.oldPosY=0;
    this.oldPosY=0;
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
            this.oldPosY=this.y;
            this.oldPosX=this.x;
            this.graphDir.y = dirY; //la direction de l'animation
            this.graphDir.x = dirX; //la direction de l'animation
            this.delay=0;
            for (var i = 0 ; i< game.tails.length;i++){
                if(i>0){
                    game.tails[i].oldPosY=game.tails[i-1].oldPosY
                    game.tails[i].oldPosX=game.tails[i-1].oldPosX
                    
                }
            } 
            
             
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
    this.next;
    this.x=x;
    this.y=y;
    this.width=game.tileSize;
    this.height=game.tileSize;
    this.oldPosX=0;
    this.oldPosY=0;
    this.draw=function draw(){
            this.oldPosX=this.next.oldPosX;
            this.oldPosY=this.next.oldPosY;
                  
            this.refGame.context.fillStyle = "red";
            this.refGame.context.fillRect(this.next.oldPosX, this.next.oldPosY, this.width, this.height);

    }
    this.next = null;
    this.move = function(x,y) {
        if (this.next) {
            this.next.move(this.x,this.y);
        }
        this.x = x;
        this.y = y;
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
    
    for(var i=0;i<game.tails.length;i++){
        game.tails[i].draw();

    }  
}
//----------------------------------------------------------------
function manageItem(game){
    if(collisionSquares(game.snake,game.item)){
        game.item.x = (Math.random()*24|0)*game.tileSize;
        game.item.y = (Math.random()*24|0)*game.tileSize;
        //On ajoute une nouvelle queue
        if(game.tails.length>=1){ 
            console.log("ok2")
            var newTails = new Tail(game, game.tails[game.tails.length-1].oldPosX, game.tails[game.tails.length-1].oldPosY)
            game.tails.push(newTails);
            game.tails[game.tails.length-1].next=newTails;
        }
        else{
            console.log("ok1")
            game.tails.push(new Tail(game,0,0));
            var oldTails = game.tails[game.tails.length-1];
            oldTails.next=game.snake;    
        }
        
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
