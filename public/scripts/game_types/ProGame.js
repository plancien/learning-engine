/*

@name 
    Progame
@endName

@description
    Progame
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/render',
    'modules/mouse',
    'modules/particle_generator',
    'connector',
    'modules/bonus_chooser',
    'modules/key_listener',
], function(eventBus, canvasCreate, frames, render, mouse, particles,connector, keyListner){

    return function(params) {

//-----------------------------------------------
//                     VARS
//-----------------------------------------------
        //canvas
        var canvas, ctx;
        var paramsCanvas = {
            id: "Progame",
            width: 800,
            height: 800
        };

        //Mouse
        var mousePos = {
            x: 0,
            y: 0,
            isClicking: {}
        };

        //VarsContainer
        var gameContainer = {
            idOfPlayer : '',
            Players : {},
            nbOfPlayer : 0,
            colors : ['red','green','blue','purple','orange','brown','yellow'],
        };
//-----------------------------------------------
//                     INIT
//-----------------------------------------------
        eventBus.on('init', function() {
            particles();
            canvas = canvasCreate.create(paramsCanvas);
            ctx = canvas.context;
            ctx.font = '14pt Calibri';
            connector.emit('create new player');
        });
//-----------------------------------------------
//                     MAIN LOOP
//-----------------------------------------------

        eventBus.on("new frame", function() {
            ctx.clearRect(0,0,canvas.canvas.width,canvas.canvas.height);
            var i = 0;
            for(var key in gameContainer.Players){
              i+=50;
              gameContainer.Players[key].render(ctx);
              gameContainer.Players[key].drawScore(ctx,i)
            }
        });
//-----------------------------------------------
//                     EVENTS
//-----------------------------------------------
        //MOUSE UPDATE POSITION
        eventBus.on('mouse update', function(data) {
            mousePos.x = data.canvasX;
            mousePos.y = data.canvasY;
            mousePos.isClicking = data.isClicking;
        });

        //CREATE OWN PLAYER
        connector.on("your player",function(playerID){
          gameContainer.Players[playerID] = new Player(playerID,gameContainer.colors[gameContainer.nbOfPlayer]);
          gameContainer.idOfPlayer=playerID;
          addInputControl(gameContainer.Players[playerID]);
          addSendPositionCapabilities(gameContainer.Players[playerID]);
        });

        //CREATE NEW PLAYER
        connector.on("new player", function(playerID){
          gameContainer.nbOfPlayer++;
          gameContainer.Players[playerID] = new Player(playerID,gameContainer.colors[gameContainer.nbOfPlayer]);
        });

        //LOAD ALL Players
        connector.on("Add all Players",function(UsersID){
          for(var key in UsersID){
            if(UsersID[key] != gameContainer.idOfPlayer){
              gameContainer.nbOfPlayer++;
              gameContainer.Players[UsersID[key]] = new Player(UsersID[key],gameContainer.colors[gameContainer.nbOfPlayer]);
            }
          } 
        });

        //SEND YOUR NEW POSITION
        connector.on("new position",function(player){
            gameContainer.Players[player.id].move(player.x,player.y);
        });
        //les autres ont bougé
        eventBus.on('coords update', function(data) {
          console.log(data)
          gameContainer.Players[data.id].x = data.x;
          gameContainer.Players[data.id].y = data.y;
        });
        //WHEN PPL DISCONNECT
        connector.on('player left',function(user){
          gameContainer.nbOfPlayer--;
          delete gameContainer.Players[user];
        });
        
//-----------------------------------------------
//                     OTHERS
//-----------------------------------------------
        function Player(id,color){
          this.x = 0;
          this.y = 0;
          this.w = 30;
          this.h = 30;
          this.id = id || Math.random()*1000;

          this.angle = 0;
          this.points = 0;
          this.MAXSPEED = 10;
          this.accel = 0.2
          this.speed = {x : 0,y : 0};
          this.color = color;
          this.syncPosFromServer = function(e){
           if(e.id = this.id){
               this.move(e.x,e.y);
           }
          };
          this.move = function(x, y){
           this.x += x;
           this.y += y;
          };
          this.render = function(context){
            generateParticles({x : this.x , y : this.y, color : this.color})
          };

          this.drawScore = function(context,i){
            context.fillStyle = this.color;
            context.fillText(this.color+' : ', 100+i, 30);
            context.fillText(this.points, 100+i, 60);
          };
        };

        function addInputControl(object){
          eventBus.on('keys still pressed', function(e){
            var oldPosition = {
               x:object.x,
               y:object.y
            };
            if(Math.abs(object.speed.x) < object.MAXSPEED){
             if(e == "left"){
                object.speed.x -= object.accel;
             }
             if(e == "right"){
                object.speed.x += object.accel;
             }
            }
            if(Math.abs(object.speed.y) < object.MAXSPEED){
             if(e == "up"){
                object.speed.y -= object.accel;
             }
             if(e == "down"){
                object.speed.y += object.accel;
             }
            }
            object.x += object.speed.x;
            object.y += object.speed.y;
            //this.angle = getOrientation(object.speed);
            if(object.x != oldPosition.x || object.y != oldPosition.y){
               connector.emit('coords', {id:object.id,x:object.x,y:object.y});
            }
          });
        }

        function addSendPositionCapabilities(object){
          object.sendPositionToServer = function(){
              connector.emit('position from client',{id:this.id,x:this.x,y:this.y});
          }
        };

        function generateParticles(pos){
            var ParaticlesParams = {
                x : pos.x,
                y : pos.y,
                size : 5,
                style : true,
                lifeTime : 100,
                speed : 2,
                count:10,
                angle : -0.5,
                color : pos.color,
            }
            eventBus.emit('CreateParticles', ParaticlesParams);
        }
//-----------------------------------------------
//                     VECTORS
//-----------------------------------------------
        function getOrientation(vect){
          var unit = unitVector(vect);
          if (unit.y < 0) {
              return - Math.acos(unit.x);
          }
          else {
              return Math.acos(unit.x);
          }
        };

        function unitVector(vect) {
          var length = lengthVector(vect);
          return {x:vect.x/length,y: vect.y/length};
        };

        function lengthVector(vect) {
          return Math.sqrt(vect.x*vect.x + vect.y*vect.y);
        };
    };
});
