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
    'modules/add_canvasBoundingBox'
], function(eventBus, canvasCreate, frames, render, mouse, particles,connector, keyListner){

    return function(params) {
//-----------------------------------------------
//                     VARS
//-----------------------------------------------
        //canvas
        var canvas, ctx;
        var paramsCanvas = {
            id: "Progame",
            width: 1280,
            height: 720
        };

        //Mouse
        var mousePos = {
            x: 0,
            y: 0,
            isClicking: {}
        };

        //VarsContainer
        var gameContainer = {
            intervalRepop : 350,
            state : 'Play',
            winner : '',
            frame: 0,
            maxPoints : 100,
            goodImages : new Image(),
            badImages : new Image(),
            bonus : [],
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
            for(var key in params){
              if(key == "bonusUrl"){
                gameContainer.goodImages.src = params[key];
              }
              else if (key == "malusUrl"){
                gameContainer.badImages.src= params[key];
              }
            }
            connector.emit('create new player');
        });
//-----------------------------------------------
//                     MAIN LOOP
//-----------------------------------------------

        eventBus.on("new frame", function() {
            ctx.clearRect(0,0,canvas.canvas.width,canvas.canvas.height);
            if(gameContainer.state == 'Play'){
              GenerateBonus(canvas.canvas);
              PlayerManage(ctx,canvas.canvas);
              BonusManage(ctx);
              gameContainer.frame++;
            }
            else if(gameContainer.state == 'Over'){
              var l = ctx.measureText(gameContainer.winner+' WIN!!!').width;
              ctx.fillText(gameContainer.winner+' WIN!!!',canvas.canvas.width*0.5-l,canvas.canvas.height*0.5);
              var i = 0;
              for(var key in gameContainer.Players){
                i+=100;
                gameContainer.Players[key].drawScore(ctx,20+i,canvas.canvas.height*0.5+50)
              }
            }
        });
//-----------------------------------------------
//              MAIN LOOP ELEMENTS
//-----------------------------------------------
        function GenerateBonus(canvas){
          if(gameContainer.frame % gameContainer.intervalRepop == 0){
            gameContainer.bonus.push(new Bonus(true,canvas));
            gameContainer.bonus.push(new Bonus(false,canvas));
          }
        }

        function PlayerManage(ctx,canvas){
          var i = 0;
          for(var key in gameContainer.Players){
            i+=50;
            gameContainer.Players[key].render(ctx);
            gameContainer.Players[key].drawScore(ctx,20+i,30)
            gameContainer.Players[key].deceleration();
            gameContainer.Players[key].collision(canvas,gameContainer.bonus);
            if(gameContainer.Players[key].points>=gameContainer.maxPoints){
              EndGame(key);
            }
          }
        }
        function BonusManage(ctx){
          for (var i = gameContainer.bonus.length - 1; i >= 0; i--){
            gameContainer.bonus[i].render(ctx);
            gameContainer.bonus[i].lifeTime--;
            if(gameContainer.bonus[i].lifeTime<0){
              gameContainer.bonus.splice(i,1);
            }
          };
        }
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
        connector.on('Add all Players',function(UsersID){
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
        connector.on('coords update', function(data) {
          gameContainer.Players[data.id].x = data.x;
          gameContainer.Players[data.id].y = data.y;
        });
        //WHEN PPL DISCONNECT
        connector.on('player left',function(user){
          gameContainer.nbOfPlayer--;
          delete gameContainer.Players[user];
        });
        
//-----------------------------------------------
//                     PLAYER
//-----------------------------------------------
        function Player(id,color){
          //proprieté du player
          this.x = 0;
          this.y = 0;
          this.w = 30;
          this.h = 30;
          this.id = id || Math.random()*1000;
          //gestion vitesse
          this.angle = 0;
          this.points = 0;
          this.MAXSPEED = 4;
          this.accel = 0.2;
          this.decel = 0.1;
          this.speed = {x : 0,y : 0};
          this.color = color;
          //divers 
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
            generateParticles({x : this.x , y : this.y, color : this.color, angle : this.angle})
          };

          this.drawScore = function(context,x,y){
            context.fillStyle = this.color;
            context.fillText(this.color+' : ',x,y);
            context.fillText(this.points,x,y+30);
          };
          this.deceleration = function(){
            if(Math.abs(this.speed.x)>0){
              this.speed.x <0 ? this.speed.x+=this.decel : this.speed.x-=this.decel
              if(Math.abs(this.speed.x)<this.decel){
                this.speed.x=0;
              }
            }
            if(Math.abs(this.speed.y)>0){
              this.speed.y <0 ? this.speed.y+=this.decel : this.speed.y-=this.decel
              if(Math.abs(this.speed.y)<this.decel){
                this.speed.y=0;
              }
            }
            this.x += this.speed.x;
            this.y += this.speed.y;
          }
          this.collision = function(canvas,bonus){
            if(this.x<0 || this.x>canvas.width-this.w){
              this.x += -(this.speed.x)*5;
            }
            if(this.y<0 || this.y>canvas.height-this.h){
              this.y += -(this.speed.y)*5;
            }
            for (var i = 0; i < bonus.length; i++) {
              if(CheckCollision(this,bonus[i])){
                this.points += bonus[i].point;
                bonus.splice(i,1);
                i--;
              }
            };
          }
        };
//-----------------------------------------------
//                     BONUS
//-----------------------------------------------
        function Bonus(value,canvas){
          this.w = 40;
          this.h = 60;
          this.x = canvas.width * Math.random() - this.w;
          this.y = canvas.height * Math.random() - this.h;
          this.lifeTime = 200;

          if(value){
            this.image = gameContainer.goodImages;
            this.point = 100;
          }
          else{
            this.image = gameContainer.badImages;
            this.point = -25;
          }

          this.render = function(context){
            context.drawImage(this.image,this.x,this.y,this.w,this.h);
          };
        }

//-----------------------------------------------
//                     FUNCTIONS
//-----------------------------------------------
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
            this.angle = getOrientation(object.speed);

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

        function CheckCollision(object1,object2){
          if((object1.x < (object2.x + object2.w)) && ((object1.x + object1.w) > object2.x) && 
              (object1.y < (object2.y + object2.h)) && ((object1.y + object1.h) > object2.y)){
            return true;
          }  
          else{
            return false;
          }
        };

        function generateParticles(pos){
          var ParaticlesParams = {
              x : pos.x,
              y : pos.y,
              size : 5,
              style : false,
              lifeTime : 30,
              alpha : true,
              speed : 2,
              count:10,
              angle : pos.angle,
              color : pos.color,
          }
          eventBus.emit('CreateParticles', ParaticlesParams);
        }

        function EndGame(key){
          ctx.font = '24pt Calibri';
          if(key == gameContainer.idOfPlayer){
            gameContainer.winner = 'YOU';
          }
          else{
            gameContainer.winner = gameContainer.Players[key].color;
          }
          gameContainer.state = 'Over';
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
