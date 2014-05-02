define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/key_listener',
    'event_capabilities',
    'connector',
    "modules/mouse",
    "modules/add_canvasBoundingBox",
    "modules/particle_generator"
], function (eventBus,canvasCreate,framer,keyListener,addEventCapabilities,connector,mouse,canvasBoundingBox,Particle) {  //Déclare les variables contenant les modules chargé dans define([])

  //Le module retourné
    return function(params) {
        var container;
        //équivalent du window.onload
        eventBus.on('init', function (_container) {
          connector.emit("load routine server -g",{path:"timoteyServer"},"timoteyStockingKey");
          //???
            container = _container;
            //Ici je récupère le canvas, canvasCreate est le module canvas.js chargé plus haut
            Particle();


            var canvas = canvasCreate.create({width:800,height:600,id:"TimoteyCanvas"});
            var context = canvas.context;
            context.fillStyle = "black";
            context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            
            var players = {};
            var ownPlayerId = connector.socket.sessionid;
            
            var bullets = {};
            
            var powerUp = {};
            
            var time = new Time();
            

            //RETURN RGBA COLOR
            function randomColorRGBA(alpha){
              var r = (Math.random()*255)|0;
              var g = (Math.random()*255)|0;
              var b = (Math.random()*255)|0;
              var a = alpha ? Math.random() : 1; 
              var rgba="rgba("+r+","+g+","+b+","+a+")";
              return rgba;
            };

            //MANAGE TIME
            function Time(){
              this.elapsedTime = 0;
              this.deltaTime = 0;
              this.frame = 0;
            };

            //COMPONENT POWERUP
            function PowerUp(x, y, w, h, color, id, type, modification){
              this.x = x;
              this.y = y;
              this.w = w;
              this.h = h;

              this.id = id;
              this.color = color || "white";

              this.type = type;
              this.modification = {};

              for(var key in modification){
                this.modification[key] = modification[key];
              }

              this.useOnPlayer = function(player){
                // player = Player()
                // dataUpdate = modif to player
                // dataSend = modif to player + id power up a suppr
                var dataUpdate = {id:player.id};
                var dataSend = {idPlayer:player.id, idPowerUp:this.id, playerModification:{}};

                for(var key in this.modification){
                  player[key] += this.modification[key];
                  dataUpdate[key] = player[key];
                  dataSend.playerModification[key] = player[key];
                }

                connector.emit("infoToSync -g",{id:player.id,eventName:"player get powerup",objectKey:"users",
                  update:dataUpdate,
                  send:dataSend
                });

                connector.emit("delete info -g",{objectKey:"powerUps",idObject:this.id});
              };

              this.draw = function(context){
                context.fillStyle = this.color;
                context.fillRect(this.x,this.y,this.w,this.h);
              };

              this.collision = function(object){

                if((this.x >= object.x + object.w)      // trop à droite
                    || (this.x + this.w <= object.x) // trop à gauche
                    || (this.y >= object.y + object.h) // trop en bas
                    || (this.y + this.h <= object.y))  // trop en haut
                      return false;
                    else{
                      this.useOnPlayer(object);
                      return true;
                    }
              };

            };

            //COMPONENT NPC (AKA PLAYER)
            function NPC(x, y, w, h, id, health, maxHealth, alive, color, score){

               this.id = id || Math.random()*1000;
               this.score = score || 0;

               this.x = x || 0;
               this.y = y || 0;
               this.w = w || 30;
               this.h = h || 30;
               
               this.health = health || 30;
               this.maxHealth = maxHealth;
               this.alive = alive;

               this.speed = 10;
               this.bulletSpeed = 10;
               this.bulletDamage = 5;

               this.color = color || "white";
               this.deathColor = "black";
               
               
               this.syncPosFromServer = function(e){

                  if(e.id = this.id){
                    this.move(e.x,e.y);
                  }

               };

               this.move = function(x,y){
                   this.x = x;
                   this.y = y;
               };

               this.draw = function(context){

                if(this.alive){
                  context.fillStyle = this.color;
                }
                else{
                  context.fillStyle = this.deathColor;
                }

                context.fillRect(this.x,this.y,this.w,this.h);

               };

               this.takeDamageNPC = function(amountOfDamage){
                this.health -= amountOfDamage;
               };

               this.killNPC = function(){
                this.alive = false;
               };

               this.respawn = function(){

                this.alive = true;
                this.health = this.maxHealth;

                this.x = Math.random() * 700;
                this.y = Math.random() * 500;
                this.w = 30;
                this.h = 30;

                this.speed = 10;
                this.bulletSpeed = 10;
                this.bulletDamage = 5;

               };
            };

            //CLASS BULLET
            function Bullet(x, y, vector, speed, id, idInArray, color, damage){
              this.id = id;
              this.idInArray = idInArray;

              this.alive = true;
              
              this.x = x;
              this.y = y;
              this.w = 4;
              this.h = 4;
              
              this.vector = vector;
              this.speed = speed;
              
              this.color = color
              
              this.damage = damage || 10;

              this.move = function(){

                var oldPosition = { x: this.x, y: this.y};

                this.x += this.vector.x*this.speed;
                this.y += this.vector.y*this.speed;

              };

              this.draw = function(context){

               context.fillStyle = this.color;
               context.fillRect(this.x,this.y,this.w,this.h);

              };
            };

            //COMPONENT POSITION SENDING
            function addSendPositionCapabilities(object){
               object.sendPositionToServer = function(){
                   connector.emit('modification player -g',{id:this.id,x:this.x,y:this.y});
               }
            };

            //COMPONENT INPUT CONTROL
            function addInputControl(object){

              eventBus.on('keys still pressed', function(e){
                   var oldPosition = {
                       x:object.x,
                       y:object.y
                   };

                   var previewX = object.x;
                   var previewY = object.y;
                   
                   if(e == "Q"){
                      previewX = object.x - object.speed;
                   }
                   if(e == "D"){
                      previewX = object.x + object.speed;
                   }
                   if(e == "Z"){
                      previewY = object.y - object.speed;
                   }
                   if(e == "S"){
                      previewY = object.y + object.speed;
                   }
                   
                   eventBus.emit("outside canvas",{canvas:canvas.canvas,target:{oldX:oldPosition.x,oldY:oldPosition.y,x:previewX,y:previewY,w:object.w,h:object.h}});
              });

              eventBus.on("outside canvas response",function(params){

                  if(!params.isPartiallyOutOnX){
                     object.x = params.x;
                  }
                  if(!params.isPartiallyOutOnY){
                     object.y = params.y;
                  }
                  if(object.x != params.oldX || object.y != params.oldY){
                    connector.emit('infoToSync -g', {id:object.id,eventName:"new position",objectKey:"users",update:{
                        x:object.x,y:object.y
                      },
                      send:{
                        x:object.x,y:object.y
                      }
                    });
                  }

              });
              
              eventBus.on("mouse left is clicking",function(mouse){

                if(object.alive){

                  var vector ={
                    x:mouse.canvasX-(object.x+(object.w*0.5)),
                    y:mouse.canvasY-(object.y+(object.h*0.5))
                  };

                  var longueur = Math.sqrt(vector.x*vector.x+vector.y*vector.y);

                  vector.x /= longueur;
                  vector.y /= longueur;

                  object.shoot(vector);

                }

               });
            };

            //COMPONENT SHOOT CAPABILITIES
            function addShootCapabilities(object){

              object.shoot = function(vector){

                bullets[this.id].push(new Bullet( this.x+this.w*0.5, this.y+this.h*0.5, vector, this.bulletSpeed, this.id, bullets[this.id].length, this.color, this.bulletDamage));
                
                connector.emit("infoToSync -g", {id:this.id,eventName:"player shoot",objectKey:"bullets",
                  update:{
                    x: this.x+this.w*0.5, y: this.y+this.h*0.5, speed: this.bulletSpeed, vectorSend: {x:vector.x,y:vector.y}, id: this.id, idInArray: bullets[this.id].length-1, color: this.color, damage: this.bulletDamage
                  },
                  send:{
                    x: this.x+this.w*0.5, y: this.y+this.h*0.5, speed: this.bulletSpeed, vectorSend: {x:vector.x,y:vector.y}, id: this.id, idInArray: bullets[this.id].length-1, color: this.color, damage: this.bulletDamage
                  }
                });

              };

            };

            //RETURN DOM SCORE
            function createScoreDOM(id, score, own){
              var domScore = document.createElement("p");
              domScore.id = id;
              domScore.style.color = players[id].color;
              domScore.innerHTML = id + " : "+ score;
              document.body.appendChild(domScore);

              if(own){
                var changeName = document.createElement("input");
                changeName.id = id;
                document.body.appendChild(changeName);

                var btn = document.createElement("input");
                btn.type = "button";
                btn.id = id;
                btn.value = "send";

                btn.onclick = function(){
                  domScore.innerHTML = changeName.value + " : " + score;
                  players[id].name = changeName.value;
                  connector.emit("infoToSync -g", {id:id,eventName:"name changed",objectKey:"users",
                    update:{
                      id:id,
                      name:players[id].name
                    },
                    send:{
                      id:id,
                      name:players[id].name
                    }
                  });
                };

                document.body.appendChild(btn);
              }
            };

            //UPDATE DOM ELEMENT
            function updateScoreDOM(id){
              var player = players[id];

              var element = document.getElementById(player.id);
              element.innerHTML = (player.name || player.id) + " : "+ player.score; 
            };

            //DEATH SENDING CAPABILITIES
            function addSendDeathCapabilities(object){

              object.respawnDelay = 180;
              object.frameSinceDeath = 0;

              object.takeDamage = function(amountOfDamage,idKiller){
                
                this.health -= amountOfDamage;

                connector.emit("infoToSync -g",{id:object.id,eventName:"player hit",objectKey:"users",
                  update:{
                    id: object.id, health: object.health
                  },
                  send:{
                    id: object.id, health: object.health
                  }
                });

                if(this.health <= 0){
                  object.kill(idKiller)
                }

              };

              object.kill = function(idKiller){
                this.alive = false;

                connector.emit("infoToSync -g",{id:object.id, eventName:"player kill",
                  update:{
                    id: object.id,
                    alive: false
                  },
                  send:{
                    id: object.id,
                    idKiller:idKiller
                  }
                });

                players[idKiller].score+=100;

                updateScoreDOM(idKiller);
              };

              object.collision = function(targetArray){

                var arrayColliding = [];
                
                for(var i = 0 ; i < targetArray.length; i++){
                  if((targetArray[i].x >= object.x + object.w)      // trop à droite
                    || (targetArray[i].x + targetArray[i].w <= object.x) // trop à gauche
                    || (targetArray[i].y >= object.y + object.h) // trop en bas
                    || (targetArray[i].y + targetArray[i].h <= object.y))  // trop en haut
                      continue; 
                    else
                      arrayColliding.push({bullet:targetArray[i],i:i}); 
                }
                
                return arrayColliding;
              };

              object.waitForSpawn = function(){
                
                this.frameSinceDeath++;
                
                if(this.frameSinceDeath >= this.respawnDelay){

                  this.frameSinceDeath = 0;
                  this.respawn();

                  connector.emit("infoToSync -g",{id:this.id,eventName:"player respawn",
                    update:{
                      x:this.x,y:this.y,w:this.w,h:this.h,bulletSpeed:this.bulletSpeed,bulletDamage:this.bulletDamage,speed:this.speed,health:this.maxHealth,id:this.id,alive:true
                    },
                    send:{
                      x:this.x,y:this.y,w:this.w,h:this.h,bulletSpeed:this.bulletSpeed,bulletDamage:this.bulletDamage,speed:this.speed,health:this.maxHealth,id:this.id,alive:true
                    }
                  });

                }
              
              };
            };

            /*********************************************
                      -OWN PLAYER MANAGEMENT-
            *********************************************/
            players[ownPlayerId] = new NPC( (Math.random()*canvas.canvas.width-30)|0, (Math.random()*canvas.canvas.height-30)|0, 30, 30, ownPlayerId, 30, 30, true, randomColorRGBA(), 0);
            addInputControl(players[ownPlayerId]);
            addSendPositionCapabilities(players[ownPlayerId]);
            addShootCapabilities(players[ownPlayerId]);
            addSendDeathCapabilities(players[ownPlayerId]);
            bullets[ownPlayerId] = [];
            createScoreDOM(ownPlayerId,players[ownPlayerId].score,true);

            //LOAD PLAYERS SUBSCRIBING
            connector.on("load players",function(users){

              for(var key in users){
                if(users[key].id != ownPlayerId){
                  players[users[key].id] = new NPC( users[key].x, users[key].y, users[key].w, users[key].h, users[key].id, users[key].health, users[key].maxHealth, users[key].alive, users[key].color, users[key].score);
                  bullets[users[key].id] = [];
                  createScoreDOM(users[key].id,users[key].score);
                }
              }

            });

            //LOAD POWER UP SUBSCRIBING
            connector.on("load powerUps",function(powerUps){

              for(var key in powerUps){
                powerUp[powerUps[key].id] = new PowerUp( powerUps[key].x, powerUps[key].y, powerUps[key].w, powerUps[key].h, powerUps[key].color, powerUps[key].id, powerUps[key].type, powerUps[key].modification);
              }
              
            });

            //EMIT OWN PLAYER CREATED
            connector.emit("create player -g",{
              id:ownPlayerId,
              x:players[ownPlayerId].x,
              y:players[ownPlayerId].y,
              w:players[ownPlayerId].w,
              h:players[ownPlayerId].h,
              health:players[ownPlayerId].health,
              maxHealth:players[ownPlayerId].maxHealth,
              alive:players[ownPlayerId].alive,
              color:players[ownPlayerId].color,
              score:players[ownPlayerId].score
            });

            //LOADER EMIT
            connector.emit("load -g");
            connector.emit("load -g","powerUps");

            //NAME CHANGED SUBSCRIBING
            connector.on("name changed", function(data){

              players[data.id].name = data.name;
              updateScoreDOM(data.id);

            });

            //NEW PLAYER SUBSCRIBING
            connector.on("new player", function(player){

               players[player.id] = new NPC(player.x, player.y, player.w, player.h, player.id, player.health, player.maxHealth, player.alive, player.color, player.score);
               bullets[player.id] = [];
               createScoreDOM(player.id,player.score);

            });
            
            //NEW POSITION SUBSCRIBING
            connector.on("new position",function(player){
               players[player.id].move(player.x,player.y);
            });

            //PLAYER DISCONNECT SUBSCRIBING
            connector.on('player disconnected',function(user){

               var element = document.getElementById(user.id);
               document.body.removeChild(element);
               delete players[user.id];

            });
            
            //PLAYER SHOOT SUBSCRIBING
            connector.on("player shoot", function(shoot){

              if(!bullets[shoot.id]){
                bullets[shoot.id] = [];
              }

              bullets[shoot.id].push(new Bullet(shoot.x,shoot.y,shoot.vectorSend,shoot.speed,shoot.id, shoot.idInArray,shoot.color));

            });

            //PLAYER RESPAWN SUBSCRIBING
            connector.on("player respawn", function(player){
              players[player.id].alive = true;
              players[player.id].x = player.x;
              players[player.id].y = player.y;
              players[player.id].w = player.w;
              players[player.id].h = player.h;
              players[player.id].speed = player.speed;
              players[player.id].bulletSpeed = player.bulletSpeed;
              players[player.id].bulletDamage = player.bulletDamage;
            });

            //PLAYER HIT SUBSCRIBING
            connector.on("player hit", function(data){
              players[data.id].health = data.health;
            });

            //PLAYER KILL SUBSCRIBING
            connector.on("player kill",function(death){
              players[death.id].alive = false;
              if(death.idKiller == ownPlayerId){
                players[ownPlayerId].score +=100;
                updateScoreDOM(ownPlayerId);
              }
            });

            //NEW POWER UP SUBSCRIBING
            connector.on("new powerup", function(data){
              powerUp[data.id] = new PowerUp(data.x, data.y, data.w, data.h, data.color, data.id, data.type,data.modification);
            });

            //PLAYER GET POWER UP SUBSCRIBING
            connector.on("player get powerup",function(data){
              for(var key in data.playerModification){
                players[data.idPlayer][key] = data.playerModification[key];
              }
              delete powerUp[data.idPowerUp];
            });

            //COLLISION BULLET SUBSCRIBING
            connector.on("collision bullet", function(data){
              for(var i = 0; i < data.arrayColliding.length; i++){
                bullets[data.arrayColliding[i].bullet.id].splice(data.arrayColliding[i].bullet.idInArray,1);
              }
            });
            
            //NEW FRAME SUBSCRIBING ( MAIN LOOP )
            eventBus.on('new frame', function(){
              //CLEAN CANVAS
              context.fillStyle = "black";
              context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);

              //DRAW ALL PLAYERS
              for(var key in players){
                   players[key].draw(context);
              }
              
              //MANAGE ALL BULLETS
              for(var key in bullets){
                for(var i = 0; i < bullets[key].length; i++){
                  bullets[key][i].move();
                  bullets[key][i].draw(context);
                  if(!bullets[key][i].alive){
                    bullets[key].splice(i,1);
                    i--;
                  }
                }
              }

              //DRAW ALL POWER UP
              for(var key in powerUp){
                powerUp[key].draw(context);
              }

              //OWN PLAYER MANAGEMENT
              if(ownPlayerId != null){
                //PLAYER ALIVE
                if(players[ownPlayerId].alive){

                  //BULLET MANAGEMMENT FOR OWN PLAYER
                  for(var key in bullets){

                    //EXE IF NOT OWN BULLET
                    if(key != ownPlayerId){

                      //GET BULLETS COLLIDING WITH OWN PLAYER
                      var arrayColliding = players[ownPlayerId].collision(bullets[key]);

                      //FOR ALL BULLETS COLLIDING -> APPLY TAKEDAMAGE
                      for(var i = 0; i < arrayColliding.length; i++){
                        players[ownPlayerId].takeDamage(arrayColliding[i].bullet.damage,arrayColliding[i].bullet.id);
                        bullets[key].splice(arrayColliding[i].idInArray,1);
                      }

                      if(arrayColliding.length > 0){

                        //SEND DESTROY EVENT
                        connector.emit("infoToSync -g",{
                          id:ownPlayerId,
                          eventName:"collision bullet",
                          objectKey:"bullets",
                          update:{
                          },
                          send:{
                            arrayColliding:arrayColliding
                          }
                        });
                      }
                      //
                    }
                  }

                  //COLLISION ALL POWER UPS WITH PLAYER
                  for(var key in powerUp){
                    if(powerUp[key].collision(players[ownPlayerId])){
                      delete powerUp[key];
                    }
                  }
                  
                }
                else{
                  //WHEN YOU ARE DEAD
                  players[ownPlayerId].waitForSpawn();
                }
              }
            });
        });
    }
});