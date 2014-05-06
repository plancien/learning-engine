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
    game.manageScore=new ManageScore(game); 
    game.snake = new Snake(game);
    game.item= [new Item(game),new Item(game),new Item(game)];
    game.tails=[];
    addEventCapabilities(game);
    game.on('move snake', function(e){
        game.snake.move(e); 
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
    this.moveDelay= 9;
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
            if (this.input!="down")
            this.input="up";
            break;
            case 'down':
            if (this.input!="up")
            this.input="down";
            break;
            case 'left':
            if (this.input!="right")
            this.input="left";
            break;
            case 'right':
            if (this.input!="left")
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
            
             
        }
    };
    this.moveTails = function() {
        if (this.next) {
            
            this.next.move(this.x,this.y);
        }
        this.x += this.graphDir.x * (game.tileSize/this.moveDelay);
        this.y += this.graphDir.y * (game.tileSize/this.moveDelay);
    }
    this.replaceSnake=function replaceSnake(){
        if(this.x-this.width>this.refGame.canvas.width){
            this.x = 0;
        }
        else if(this.y-this.height>this.refGame.canvas.height){
            this.y=0;
        }
        else if(this.x+this.width<0){
            this.x=this.refGame.canvas.width;
        }
        else if(this.y+this.height<0){
            this.y=this.refGame.canvas.height;
        }
    }
    this.update=function update(){
        this.delay++;
        this.replaceSnake();
        this.moveTails();
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
    this.oldPos={
        x:0,
        y:0
    }
    this.draw=function draw(){
        this.refGame.context.fillStyle = "red";
        this.refGame.context.fillRect(this.oldPos.x, this.oldPos.y, this.width, this.height);     
    }
    this.move = function(x,y) {
        if (this.next) {
            this.next.move(this.oldPos.x,this.oldPos.y);
        }
        this.oldPos.x = x;
        this.oldPos.y = y;
    }
    
}
//---------------------------------MANAGE SCORE--------------------------
function ManageScore(game){
    this.refGame=game;
    this.score=0;
    this.action=function action(action){//modification des regles en fonction du score
        if(action=="addScore")
            this.score++
        if(action=="resetScore")
            this.score=0;
        switch(this.score){
            case 0:
            this.refGame.snake.moveDelay=9;
            break;
            case 5:
            this.refGame.snake.moveDelay=8;
            break;
            case 15:
            this.refGame.snake.moveDelay=7;
            break;
            case 25:
            this.refGame.snake.moveDelay=6;
            break;
            case 35:
            this.refGame.snake.moveDelay=5;
            this.refGame.item.push(new Item(this.refGame))
            break;
            case 70:
            this.refGame.snake.moveDelay=4;
            break;
            case 100:
            this.refGame.snake.moveDelay=3;
            this.refGame.item.push(new Item(this.refGame))
            break;       
        }
    }
    this.draw=function draw(){
        this.refGame.context.fillStyle = "blue";
        this.refGame.context.font = "bold 50px Arial";
        this.refGame.context.fillText(this.score+"", this.refGame.canvas.width-100, this.refGame.canvas.height-50);
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
    game.snake.draw();
    for(var i = 0 ; i<game.item.length ; i++){
        game.item[i].draw();
    }    
    for(var i=0;i<game.tails.length;i++){
        game.tails[i].draw();
    }  
    game.manageScore.draw();
}
//--------------------MANAGE ITEM---------------------------
function manageItem(game){
    for(var i = 0 ; i<game.item.length ; i++){
        if(collisionSquares(game.snake,game.item[i])){
            game.manageScore.action("addScore");
            game.item[i].x = (Math.random()*24|0)*game.tileSize;
            game.item[i].y = (Math.random()*24|0)*game.tileSize;
            addTail(game);//vient rajouter une cellule a la queue du serpent
            replaceItem(game,i);//check si l'item est bien placé
        }
        
    }
}
function replaceItem(game,i){
    for (var j=0;j<game.tails.length;j++){
        //si l'objet entre en collision avec une cellule au moment ou il apparait on le replace
        if(collisionSquares(game.item[i],game.tails[j].oldPos)){
            game.item[i].x = (Math.random()*24|0)*game.tileSize;
            game.item[i].y = (Math.random()*24|0)*game.tileSize;
        }
        
    }
}
function addTail(game){
    var newTails = new Tail(game,0, 0)
    if(game.tails.length>=1){ 
        game.tails[game.tails.length-1].next=newTails;//on donne une reference de la cellule suivante
        game.tails.push(newTails);   
    }  
    else{//pour la premiere cellule elle devra suivre les positions de la tete
        game.tails.push(newTails);    
        game.snake.next = newTails;     
    }
}
//------------------------------COLLISION-------------------------------
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
