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
            var bullets = [];
            
            function NPC(x, y, id){
               this.x = x || 0;
               this.y = y || 0;
               this.w = 30;
               this.h = 30;
               this.id = id || Math.random()*1000;
               
               this.health = 10;
               this.speed = 10;
               this.bulletSpeed = 10;
               this.color = "red";
               
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
               this.shoot = function(vector){
                bullets.push(new Bullet(this.x+this.w*0.5,this.y+this.h*0.5, vector, this.bulletSpeed, this.id, this.color));
                connector.emit("shoot",{x:this.x+this.w*0.5,y:this.y+this.h*0.5,speed:this.bulletSpeed,vectorSend:{x:vector.x,y:vector.y},id:this.id,color:this.color});
               };
               this.draw = function(context){
                context.fillStyle = this.color;
                context.fillRect(this.x,this.y,this.w,this.h);
               };
            };
            function Bullet(x, y, vector, speed, id, color){
              this.x = x;
              this.y = y;
              this.w = 4;
              this.h = 4;
              this.vector = vector;
              this.speed = speed;
              this.id = id;
              this.color = color

              this.move = function(){
                   this.x += this.vector.x*this.speed;
                   this.y += this.vector.y*this.speed;
               };
              this.draw = function(context){
               context.fillStyle = this.color;
               context.fillRect(this.x,this.y,this.w,this.h);
              }
              console.log(this)
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
                  var vector ={
                    x:mouse.canvasX-(object.x+(object.w*0.5)),
                    y:mouse.canvasY-(object.y+(object.h*0.5))
                  };
                  var longueur = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
                  vector.x /= longueur;
                  vector.y /= longueur;
                  console.log(vector)
                  object.shoot(vector);
               });
            };

            //CREATE OWN PLAYER
            connector.emit('create player');
            connector.on("creation",function(player){
               players[player.id] = new NPC(player.x, player.y, player.id);
               addInputControl(players[player.id]);
               addSendPositionCapabilities(players[player.id]);
               console.log("CREATE OWN PLAYER DONE")
            });
            //CREATE NEW PLAYER
            connector.on("new player", function(player){
               players[player.id] = new NPC(player.x, player.y, player.id);
               console.log("CREATE NEW PLAYER")
            });
            //LOAD ALL PLAYERS
            connector.on("init all players",function(users){
               console.log(users)
               for(var key in users){
                   players[users[key].id] = new NPC(users[key].x, users[key].y, users[key].id);
               }
               console.log("Init Players DONE")
            });
            //INIT ALL BULLETS
            connector.on("init all bullets",function(bulletsSend){
              for(var key in bulletsSend){
                for(var i = 0; i < bulletsSend[key].length; i++){
                  bullets.push(new Bullet(bulletsSend[key][i].x,bulletsSend[key][i].y,bulletsSend[key][i].vectorSend,bulletsSend[key][i].speed,bulletsSend[key][i].id,bulletsSend[key][i].color));
                }
              }
            });
            //MOVE PARTS
            connector.on("new position",function(player){
               players[player.id].move(player.x,player.y);
            });
            //Deconnexion d'un joueur
            connector.on('player disconnected',function(user){
               console.log(user)
               delete players[user.id];
            });
            //SHOOOOOOOOT
            connector.on("shoot", function(shoot){
              bullets.push(new Bullet(shoot.x,shoot.y,shoot.vectorSend,shoot.speed,shoot.id,shoot.color));
            })


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
              for(var i = 0; i < bullets.length; i++){
                bullets[i].move();
                bullets[i].draw(context);
              }
            });
        });
    }
});