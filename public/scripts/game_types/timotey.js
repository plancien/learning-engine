define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/key_listener',
    'event_capabilities',
    'connector',
    "modules/mouse"
], function (eventBus,canvasCreate,framer,keyListener,addEventCapabilities,connector,mouse) {	//Déclare les variables contenant les modules chargé dans define([])

	//Le module retourné
    return function(params) {
        var container;
        //équivalent du window.onload
        eventBus.on('init', function (_container) {
        	//???
            container = _container;
            //Ici je récupère le canvas, canvasCreate est le module canvas.js chargé plus haut
            var canvas = canvasCreate.create({width:800,height:600,});
            var context = canvas.context;
            var players = {};
            var bullets = {};
            var ownPlayerId = null;
            var time = new Time();

            function Time(){
              this.elapsedTime = 0;
              this.deltaTime = 0;
              this.frame = 0;
            }
            
            function NPC(x, y, id, health, alive){
               this.x = x || 0;
               this.y = y || 0;
               this.w = 30;
               this.h = 30;
               this.id = id || Math.random()*1000;
               
               this.health = health || 30;
               this.alive = alive;
               this.speed = 10;
               this.bulletSpeed = 10;
               this.bulletDamage = 5;
               this.color = "red";
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
            function Bullet(x, y, vector, speed, id, color, damage){
              this.x = x;
              this.y = y;
              this.w = 4;
              this.h = 4;
              this.vector = vector;
              this.speed = speed;
              this.id = id;
              this.color = color
              this.damage = damage || 10;

              this.move = function(){
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
                   connector.emit('position from client',{id:this.id,x:this.x,y:this.y});
               }
            };
            function addInputControl(object){
               eventBus.on('keys still pressed', function(e){
                   var oldPosition = {
                       x:object.x,
                       y:object.y
                   };
                   if(e == "left"){
                       object.x -= object.speed;
                   }
                   if(e == "right"){
                       object.x += object.speed;
                   }
                   if(e == "up"){
                       object.y -= object.speed;
                   }
                   if(e == "down"){
                       object.y += object.speed;
                   }
                   if(object.x != oldPosition.x || object.y != oldPosition.y){
                       connector.emit('own player has moved', {id:object.id,x:object.x,y:object.y});
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
                connector.emit("shoot",{x:this.x+this.w*0.5,y:this.y+this.h*0.5,speed:this.bulletSpeed,vectorSend:{x:vector.x,y:vector.y},id:this.id,color:this.color,damage: this.bulletDamage});
              };
            };
            function addSendDeathCapabilities(object){
              object.respawnDelay = 180;
              object.frameSinceDeath = 0;
              object.takeDamage = function(amountOfDamage){
                this.health -= amountOfDamage;
                connector.emit("hit",{id:object.id,amountOfDamage:amountOfDamage});
                if(this.health <= 0){
                  object.kill()
                }
              }
              object.kill = function(){
                connector.emit("death",{id:object.id});
                this.alive = false;
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
                  connector.emit("respawn",{id:this.id,x:this.x,y:this.y})
                }
              }
            }

            //CREATE OWN PLAYER
            connector.emit('create player',{id:connector.socket.sessionid,x:Math.random()*700,y:Math.random()*500,health:30,color:"red",alive:true});
            connector.on("creation over",function(player, users){
               for(var key in users){
                   players[users[key].id] = new NPC(users[key].x, users[key].y, users[key].id, users[key].health, users[key].alive);
                   bullets[users[key].id] = [];
               }
               players[player.id] = new NPC(player.x, player.y, player.id, player.health, player.alive);
               ownPlayerId = player.id;
               addInputControl(players[player.id]);
               addSendPositionCapabilities(players[player.id]);
               addShootCapabilities(players[player.id]);
               addSendDeathCapabilities(players[player.id]);
               bullets[ownPlayerId] = [];


               console.log("CREATE OWN PLAYER DONE")
            });
            //CREATE NEW PLAYER
            connector.on("new player", function(player, users){
               players[player.id] = new NPC(player.x, player.y, player.id, player.health, player.alive);
               console.log("CREATE NEW PLAYER")
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
               console.log(user)
               delete players[user.id];
            });
            //New Shoot fired by someone
            connector.on("shoot", function(shoot){
              if(!bullets[shoot.id]){
                bullets[shoot.id] = [];
              }
              bullets[shoot.id].push(new Bullet(shoot.x,shoot.y,shoot.vectorSend,shoot.speed,shoot.id,shoot.color));
            });
            connector.on("respawn", function(player){
              console.log("RESPAWN OF "+player.id)
              players[player.id].alive = true;
              players[player.id].x = player.x;
              players[player.id].y = player.y;
            });
            connector.on("hit", function(hit){
              players[hit.id].takeDamageNPC(hit.damage);
              bullets[hit.id].splice(hit.i,1);
            });
            connector.on("death",function(death){
              players[death.id].alive = false;
              console.log("DEATH OF "+death.id);
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
                }
              }
              if(ownPlayerId != null){
                if(players[ownPlayerId].alive){
                  for(var key in bullets){
                    if(key != ownPlayerId){
                      var arrayColliding = players[ownPlayerId].collision(bullets[key]);
                      for(var i = 0; i < arrayColliding.length; i++){
                        players[ownPlayerId].takeDamage(arrayColliding[i].bullet.damage);
                        connector.emit("hit", {damage:arrayColliding[i].bullet.damage,id:ownPlayerId,i:arrayColliding[i].i});
                        bullets[key].splice(arrayColliding[i].i,1);
                      }
                    }
                  }
                }
                else{
                  players[ownPlayerId].waitForSpawn();
                }
              }
            });
        });
    }
});