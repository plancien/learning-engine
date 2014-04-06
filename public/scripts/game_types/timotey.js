define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/key_listener',
    'event_capabilities',
    'connector'
], function (eventBus,canvasCreate,framer,keyListener,addEventCapabilities,connector) {	//Déclare les variables contenant les modules chargé dans define([])

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
            console.log(connector)       
            
            function NPC(x, y, id){
               this.x = x || 0;
               this.y = y || 0;
               this.w = 30;
               this.h = 30;
               this.id = id || Math.random()*1000;
               
               this.speed = 10;
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
            };
            function addSendPositionCapabilities(object){
               object.sendPositionToServer = function(){
                   connector.emit('position from client',{id:this.id,x:this.x,y:this.y});
               }
            };
            function addKeyListeners(object){
               eventBus.on('key pressed', function(e){
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
            };

            //CREATE OWN PLAYER
            connector.emit('create player');
            connector.on("creation",function(player){
               players[player.id] = new NPC(player.x, player.y, player.id);
               addKeyListeners(players[player.id]);
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
            //MOVE PARTS
            connector.on("new position",function(player){
               players[player.id].move(player.x,player.y);
            });
            //Deconnexion d'un joueur
            connector.on('player disconnected',function(user){
               console.log(user)
               delete players[user.id];
            });

            context.fillStyle = "black";
            context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            //On ajoute un écouteur sur 'new frame', évènement défini dans frames.js
            //Le callback correspond à notre mainLoop / Update 
            eventBus.on('new frame', function(){
            	context.fillStyle = "black";
            	context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            	for(var key in players){
                   context.fillStyle = players[key].color;
                   context.fillRect(players[key].x,players[key].y,players[key].w,players[key].h);
                }
            });
        });
    }
});