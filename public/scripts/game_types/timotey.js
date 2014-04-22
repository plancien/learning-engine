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
], function (eventBus,canvasCreate,framer,keyListener,addEventCapabilities,connector,mouse,canvasBoundingBox,Particle) {	//Déclare les variables contenant les modules chargé dans define([])

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
            var players = {};
            var bullets = {};
            var powerUp = {};
            var ownPlayerId = connector.socket.sessionid;
            var time = new Time();

            function randomColorRGBA(){
              var r = (Math.random()*255)|0;
              var g = (Math.random()*255)|0;
              var b = (Math.random()*255)|0;
              var a = Math.random();
              var rgba="rgba("+r+","+g+","+b+",1)";
              return rgba;
            }

            function Time(){
              this.elapsedTime = 0;
              this.deltaTime = 0;
              this.frame = 0;
            }

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
                      return false 
                    else{
                      this.useOnPlayer(object);
                      return true;
                    }
              }
            };

            function NPC(x, y, w, h, id, health, maxHealth, alive, color){
               this.x = x || 0;
               this.y = y || 0;
               this.w = w || 30;
               this.h = h || 30;
               this.id = id || Math.random()*1000;
               
               this.health = health || 30;
               this.maxHealth = maxHealth;
               this.alive = alive;
               this.speed = 10;
               this.bulletSpeed = 10;
               this.bulletDamage = 5;
               this.color = color || "white";
               this.deathColor = "black";
               
               this.syncPosFromServer = function(e){
                   console.log(e.id,this.id)
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
               }
               this.killNPC = function(){
                this.alive = false;
               }
            };
            //BULLETS
            function Bullet(x, y, vector, speed, id, idInArray, color, damage){
              this.x = x;
              this.y = y;
              this.w = 4;
              this.h = 4;
              this.vector = vector;
              this.speed = speed;
              this.id = id;
              this.idInArray = idInArray;
              this.color = color
              this.damage = damage || 10;
              this.alive = true;

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
            function addSendPositionCapabilities(object){
               object.sendPositionToServer = function(){
                   connector.emit('modification player -g',{id:this.id,x:this.x,y:this.y});
               }
            };
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
            function addSendDeathCapabilities(object){
              object.respawnDelay = 180;
              object.frameSinceDeath = 0;
              object.takeDamage = function(amountOfDamage,iOfBullet){
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
                  object.kill()
                }
              }
              object.kill = function(){
                this.alive = false;
                connector.emit("infoToSync -g",{id:object.id, eventName:"player kill",
                  update:{
                    id: object.id, alive: false
                  },
                  send:{
                    id: object.id
                  }
                });
              }
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
              }
              object.waitForSpawn = function(){
                this.frameSinceDeath++;
                if(this.frameSinceDeath >= this.respawnDelay){
                  this.alive = true;
                  this.frameSinceDeath = 0;
                  this.x = Math.random()*700;
                  this.y = Math.random()*500;
                  this.health = this.maxHealth;
                  connector.emit("infoToSync -g",{id:this.id,eventName:"player respawn",
                    update:{
                      x:this.x,y:this.y,health:this.maxHealth,id:this.id,alive:true
                    },
                    send:{
                      x:this.x,y:this.y,health:this.maxHealth,id:this.id,
                    }
                  });
                }
              }
            };
            //OWN PLAYER
            players[ownPlayerId] = new NPC( (Math.random()*canvas.canvas.width-30)|0, (Math.random()*canvas.canvas.height-30)|0, 30, 30, ownPlayerId, 30, 30, true, randomColorRGBA());
            addInputControl(players[ownPlayerId]);
            addSendPositionCapabilities(players[ownPlayerId]);
            addShootCapabilities(players[ownPlayerId]);
            addSendDeathCapabilities(players[ownPlayerId]);
            bullets[ownPlayerId] = [];
            //LOAD PLAYERS
            connector.on("load players",function(users){
              console.log("LOAD PLAYERS",users);
              for(var key in users){
                if(users[key].id != ownPlayerId){
                  players[users[key].id] = new NPC( users[key].x, users[key].y, users[key].w, users[key].h, users[key].id, users[key].health, users[key].maxHealth, users[key].alive, users[key].color);
                  bullets[users[key].id] = [];
                  console.log(players[users[key].id]);
                }
              }
            });
            //LOAD POWER UP
            connector.on("load powerUps",function(powerUps){
              console.log("LOAD POWER UPS",powerUps);
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
              color:players[ownPlayerId].color
            });

            connector.emit("load -g");
            connector.emit("load -g","powerUps");

            connector.on("new player", function(player){
               players[player.id] = new NPC(player.x, player.y, player.w, player.h, player.id, player.health, player.maxHealth, player.alive, player.color);
               bullets[player.id] = [];
               console.log("PLAYER ID° "+player.id+"CONNECTED.")
            });
            //INIT ALL BULLETS
            /*connector.on("init all bullets",function(bulletsSend){
              for(var key in bulletsSend){
                if(!bullets[key]){
                  bullets[key] = [];
                }
                for(var i = 0; i < bulletsSend[key].length; i++){
                  bullets[key].push(new Bullet(bulletsSend[key][i].x,bulletsSend[key][i].y,bulletsSend[key][i].vectorSend,bulletsSend[key][i].speed,bulletsSend[key][i].id,bulletsSend[key][i].color));
                }
              }
            });*/
            //MOVE PARTS
            connector.on("new position",function(player){
               players[player.id].move(player.x,player.y);
            });
            //Deconnexion d'un joueur
            connector.on('player disconnected',function(user){
               console.log("PLAYER ID° "+user.id+"DISCONNECTED.")
               delete players[user.id];
            });
            //New Shoot fired by someone
            connector.on("player shoot", function(shoot){
              if(!bullets[shoot.id]){
                bullets[shoot.id] = [];
              }
              bullets[shoot.id].push(new Bullet(shoot.x,shoot.y,shoot.vectorSend,shoot.speed,shoot.id, shoot.idInArray,shoot.color));
            });
            connector.on("player respawn", function(player){
              players[player.id].alive = true;
              players[player.id].x = player.x;
              players[player.id].y = player.y;
              players[player.id].health = player.health;
            });
            connector.on("player hit", function(data){
              players[data.id].health = data.health;
            });
            connector.on("player kill",function(death){
              players[death.id].alive = false;
              console.log("DEATH OF "+death.id);
              //eventBus.emit("CreateParticles",{x:players[death.id].x+(players[death.id].w*0.5),y:players[death.id].y+(players[death.id].h*0.5),size:4,style:true,lifeTime:180,color:players[death.id].color,count:20});
            });
            connector.on("new powerup", function(data){
              console.log("New Power UP !")
              powerUp[data.id] = new PowerUp(data.x, data.y, data.w, data.h, data.color, data.id, data.type,data.modification);
            });
            connector.on("player get powerup",function(data){
              console.log("PLAYER ID° "+data.idPlayer+" GOT A POWER UP", data);
              for(var key in data.playerModification){
                players[data.idPlayer][key] = data.playerModification[key];
              }
              delete powerUp[data.idPowerUp];
            });
            connector.on("collision bullet", function(data){
              for(var i = 0; i < data.arrayColliding.length; i++){
                bullets[data.arrayColliding[i].bullet.id].splice(data.arrayColliding[i].bullet.idInArray,1);
              }
            });

            context.fillStyle = "black";
            context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            //On ajoute un écouteur sur 'new frame', évènement défini dans frames.js
            //Le callback correspond à notre mainLoop / Update 
            eventBus.on('new frame', function(){
              context.fillStyle = "black";
              context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
              for(var key in players){
                   players[key].draw(context);
              }
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
              for(var key in powerUp){
                powerUp[key].draw(context);
              }
              if(ownPlayerId != null){
                //UPDATE CLIENT SIDE FOR YOUR PLAYER
                if(players[ownPlayerId].alive){
                  //BULLETS
                  for(var key in bullets){
                    if(key != ownPlayerId){
                      var arrayColliding = players[ownPlayerId].collision(bullets[key]);
                      for(var i = 0; i < arrayColliding.length; i++){
                        players[ownPlayerId].takeDamage(arrayColliding[i].bullet.damage,arrayColliding[i].idInArray);
                        bullets[key].splice(arrayColliding[i].idInArray,1);
                      }
                      if(arrayColliding.length > 0){
                        //DESTRUCTION DES BULLET POUR TOUT LE MONDE
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
                    }
                  }
                  //POWERUP
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