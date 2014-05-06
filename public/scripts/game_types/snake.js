define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/collisions',
    'event_capabilities',
], function(eventBus, Canvas, Frames,collisions,addEventCapabilities, score) {
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
    this.moveDelay= 6;
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
        if(this.x>this.refGame.canvas.width){
            this.x = 0;
        }
        else if(this.y>this.refGame.canvas.height){
            this.y=0;
        }
        else if(this.x<0){
            this.x=this.refGame.canvas.width;
        }
        else if(this.y<0){
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
    this.oldPosX=0;
    this.oldPosY=0;
    this.eatable = false;
    this.draw=function draw(){
            //this.oldPosX=this.next.oldPosX;
            //this.oldPosY=this.next.oldPosY;
                  
            this.refGame.context.fillStyle = "red";
            this.refGame.context.fillRect(this.oldPosX, this.oldPosY, this.width, this.height);//c'est oldPos de next qui est dissiné ici
            //et j'update les positions dans checkdir**
            //Pas bon !
            
    }
    this.move = function(x,y) {
        if (this.next) {
            this.next.move(this.oldPosX,this.oldPosY);
        }

        this.oldPosX = x;
        this.oldPosY = y;

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
//-------------------GAMEOVER-----------------------------------
function gameOver(game){

	// if (player.dead) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "20px Verdana";
        ctx.fillText("Vous avez obtenu " + score + " points", 200, 300);
    // }
}

//------------------DRAW-----------------------------------------
function draw(game){
    game.item.draw();
    game.snake.draw();
    
    for(var i=0;i<game.tails.length;i++){
        game.tails[i].draw();

    }  
}
//--------------------MANAGE ITEM---------------------------
function manageItem(game){
    if(collisionSquares(game.snake,game.item)){
        game.item.x = (Math.random()*24|0)*game.tileSize;
        game.item.y = (Math.random()*24|0)*game.tileSize;

        console.log(game.tails)
        //On ajoute une nouvelle queue
            var newTails = new Tail(game,0, 0)
        if(game.tails.length>0){ 
            game.tails[game.tails.length-1].next=newTails;
            game.tails.push(newTails); 
            game.tails[game.tails.length].eatable = true;
        } 
        else{
            game.tails.push(newTails);
            
            game.snake.next = newTails; 
            
        }
        
        addTail(game)//vient rajouter une cellule a la queue du serpent
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
    for(var i = 1; i< game.tails.length-1; i++){
    	if(collisionTails(game.snake, game.tails[i])){
    		context.fillStyle(50,50,255);
    		gameOver(game);
    	}
    }
    if(game.snake.x>game.canvas.width)
    	game.snake.x = 0;

    if(game.snake.x<0)
    	game.snake.x = game.canvas.width;

    if(game.snake.y<0)
    	game.snake.y=game.canvas.height;

    if(game.snake.y>game.canvas.height)
    	game.snake.y = 0;
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
function collisionTails(snake, tail){
    if
    (
        (snake.x <= (tail.oldPosX + tail.width)) && 
        ((snake.x + snake.width) >= tail.oldPosX) && 
        (snake.y <= (tail.oldPosY + tail.height)) && 
        ((snake.y + snake.height) >= tail.oldPosY)&&
        tail.eatable
    ){
        console.log('collisionTail')

        console.log("snake :"+snake.x+" "+snake.y)
        console.log(tail)
        return true;    
    }
    else{
        return false;
    }
        
}
