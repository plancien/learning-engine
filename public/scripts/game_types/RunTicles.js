/*

@name 
    RunTicles
@endName

@description
    Chase ythe image and get the best score.
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
    'modules/add_canvasBoundingBox',
    'modules/countdown',
], function(eventBus, canvasCreate, frames, render, mouse, particles, connector, keyListner){

     //Canvas
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
          //General
          state : 'Play',
          winner : '',
          frame: 500,
          maxPoints : 100,
          goodImages : new Image(),
          badImages : new Image(),
          idOfPlayer : connector.socket.sessionid,
          Players : {},
          nbOfPlayer : 0,
          //Respawn Settings
          respawnPoints : [ 
                            10,10,
                            paramsCanvas.width-10,paramsCanvas.height-10,
                            paramsCanvas.width-10,10,
                            10,paramsCanvas.height-10,
                            paramsCanvas.width*0.5,10,
                            paramsCanvas.width*0.5,paramsCanvas.height-10,
                            10,paramsCanvas.height*0.5,
                            paramsCanvas.width*0.5,paramsCanvas.height*0.5
                          ],
          restartTimer : '',
          cdNewGame : 0,
          Timer : 45,
          //Bonus Setting
          bonus : {},
          colors : ['red','green','blue','purple','orange','brown','yellow'],
      };

      function initGame(params){
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
              connector.emit("load routine server -g", {path:"runTiclesServer",info:{xMax:paramsCanvas.width,yMax:paramsCanvas.height}},"RunTiclesStockingKey")
              CreateOwnPlayer(connector.socket.sessionid)
          });

          function CreateOwnPlayer(playerID){
              gameContainer.Players[playerID] = new Player(playerID,gameContainer.colors[gameContainer.nbOfPlayer]);
              addInputControl(gameContainer.Players[playerID]);
              connector.emit('create player -g',gameContainer.Players[playerID]);
              connector.emit('load -g');
          };
      }

      function mainLoopElements(){
          eventBus.on("new frame", function() {
              ctx.clearRect(0,0,canvas.canvas.width,canvas.canvas.height);
              if(gameContainer.state == 'Play'){
                  playerManage(ctx,canvas.canvas);
                  bonusManage(ctx);
              }
              else if(gameContainer.state == 'Over'){
                  afficheScoreEnd(ctx,canvas.canvas);
                  compteARebour(ctx,canvas.canvas);
              }
          });

          function playerManage(ctx,canvas){
              var i = 0;
              for(var key in gameContainer.Players){
                  i+=50;
                  gameContainer.Players[key].loop(ctx,i,canvas,gameContainer.bonus);
              }
              if(gameContainer.Players[gameContainer.idOfPlayer].points>=gameContainer.maxPoints){
                  connector.emit("game over -g",gameContainer.idOfPlayer)
              }
          };

          function bonusManage(ctx){
              for (var key in gameContainer.bonus){
                  gameContainer.bonus[key].render(ctx);
                  gameContainer.bonus[key].lifeTime--;
                  if(gameContainer.bonus[key].lifeTime<0){
                      delete gameContainer.bonus[key];
                  }
              };
          };

          function compteARebour(ctx,canvas){
              text = 'Next Game in : '+gameContainer.cdNewGame+' sec';
              ctx.fillText(text,canvas.width-ctx.measureText(text).width,30);
          };

          function afficheScoreEnd(ctx,canvas){
              var l = ctx.measureText(gameContainer.winner+' WIN!!!').width;
              ctx.fillText(gameContainer.winner+' WIN!!!',canvas.width*0.5-l,canvas.height*0.5);
              var i = 0;
              for(var key in gameContainer.Players){
                  i+=100;
                  gameContainer.Players[key].drawScore(ctx,20+i,canvas.height*0.5+50);
              }
          };
      };

      function addEvents(){
          //MOUSE UPDATE POSITION
          eventBus.on('mouse update', function(data) {
              mousePos.x = data.canvasX;
              mousePos.y = data.canvasY;
              mousePos.isClicking = data.isClicking;
          });

          //CREATE OWN PLAYER
          connector.on("load players",function(users){
            for(var key in users){
                if(users[key].id != gameContainer.idOfPlayer){
                    gameContainer.nbOfPlayer++;
                    gameContainer.Players[users[key].id] = new Player(users[key].id,gameContainer.colors[gameContainer.nbOfPlayer]);
                    gameContainer.Players[users[key].id].syncPosFromServer(users[key].x,users[key].y);
                    gameContainer.Players[users[key].id].points = users[key].points;
                }
            } 
          });

          //CREATE NEW PLAYER
          connector.on("new player", function(player){
              gameContainer.nbOfPlayer++;
              gameContainer.Players[player.id] = new Player(player.id,gameContainer.colors[gameContainer.nbOfPlayer]);
              gameContainer.Players[player.id].syncPosFromServer(player.x,player.y);
          });
          connector.on("New Bonus fedeGame",function(arg){
              gameContainer.bonus[arg['bonus']['id1']] = new Bonus(arg['bonus']['x1'],arg['bonus']['y1'],true,arg['bonus']['id1']);
              gameContainer.bonus[arg['malus']['id2']] = new Bonus(arg['malus']['x2'],arg['malus']['y2'],false,arg['malus']['id2']);
          });
          //SEND YOUR NEW POSITION
          connector.on("CoordsUpdate",function(player){
              if(gameContainer.Players[player.id]){
                  gameContainer.Players[player.id].syncPosFromServer(player.x,player.y);
              }
              else{
                  gameContainer.nbOfPlayer++;
                  gameContainer.Players[player.id] = new Player(player.id,gameContainer.colors[gameContainer.nbOfPlayer]);
                  gameContainer.Players[player.id].syncPosFromServer(player.x,player.y);
              }
          });

          eventBus.on('time remaning', function(data) {
              gameContainer.cdNewGame = data;
          });

          eventBus.on('countdown finish', function() {
              restartGame();
          });
          //WHEN PPL WIN
          connector.on('game over',function(id){
              EndGame(id)
          });
          //WHEN PPL WIN
          connector.on('BonusTake',function(info){
              gameContainer.Players[info.id].points += gameContainer.bonus[info.bonusid].point;
              delete gameContainer.bonus[info.bonusid];
          });
          //WHEN PPL DISCONNECT
          connector.on('player disconnected',function(user){
              gameContainer.nbOfPlayer--;
              console.log(gameContainer.Players[user.id])
              delete gameContainer.Players[user.id];
          });        
      };

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
          this.syncPosFromServer = function(x, y){
             this.x = x;
             this.y = y;
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
              for (var key in bonus) {
                  if(CheckCollision(this,bonus[key])){
                      connector.emit("infoToSync -g",{id:this.id,eventName:'BonusTake',update:{id:this.id,bonusid:bonus[key].id},send:{id:this.id,bonusid:bonus[key].id}});
                      this.points += bonus[key].point;
                      delete bonus[key];
                  }
              };
          }
          this.loop = function(ctx,i,canvas,bonus){
              this.render(ctx);
              this.drawScore(ctx,20+i,30)
              this.deceleration();
              this.collision(canvas,bonus);
          }
      };

      function Bonus(x,y,value,id){
            this.id = id
            this.w = 40;
            this.h = 60;
            this.x = x;
            this.y = y;
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
        };

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
                    connector.emit("infoToSync -g",{id:object.id,eventName:'CoordsUpdate',update:{x:object.x,y:object.y},send:{x:object.x,y:object.y}});
                }
            });
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
        };





        function EndGame(key){
            ctx.font = '24pt Calibri';
            if(key == gameContainer.idOfPlayer){
                gameContainer.winner = 'YOU';
            }
            else{
                gameContainer.winner = gameContainer.Players[key].color;
            }
            gameContainer.state = 'Over';
            eventBus.emit('start countdown', gameContainer.Timer);
        };

        function restartGame(){
            i=0
            for(var key in gameContainer.Players){
                gameContainer.Players[key].points = 0;
                gameContainer.Players[key].speed = {x : 0,y : 0};
                gameContainer.Players[key].x = gameContainer.respawnPoints[i];
                gameContainer.Players[key].y = gameContainer.respawnPoints[i+1];
                i+=2;
            }
            gameContainer.bonus = {};
            gameContainer.state = 'Play';
        };






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




    return function(params) {

        initGame(params);

        addEvents();

        mainLoopElements();
    };
});