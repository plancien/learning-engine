define(['event_bus','modules/frames','modules/key_listener'], function(eventBus, frames){

        var socket = io.connect('http://localhost:8075');
        var ArrayPlayer = [];

        var Player = function(life, speed, posX, posY,id)
        {
            this.id = id
            this.life = life;
            this.speed = speed;
            this.posX = posX;
            this.posY = posY;
            this.LastMove = 1;
            this.cooldown = 0;
        }

    eventBus.on('new player', function (life, speed, posX, posY,canvas,id) {
            
        ArrayPlayer.push(new Player(life, speed, posX, posY,id))
            eventBus.on("keys still pressed", function(keys)
            {

                for (var i = 0; i < keys.length; i++) 
                {
                    
                    if(keys[i] == 81)
                    {
                        ArrayPlayer[0].posX -= ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 1;
                    }   
                    else if(keys[i] == 68)
                    {
                        ArrayPlayer[0].posX += ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 2;
                    }   
                    else if(keys[i] == 90)
                    {
                        ArrayPlayer[0].posY -= ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 3;
                    }   
                    else if(keys[i] == 83)
                    {
                        ArrayPlayer[0].posY += ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 4;
                    }
                    else if(keys[i] == 69)
                    {
                        if (ArrayPlayer[0].cooldown > 20)
                        {
                            eventBus.emit('shoot', 0);
                            ArrayPlayer[0].cooldown = 0;
                        }
                    }
                }
            });
        eventBus.on("new frame", function()
        {
                ArrayPlayer[0].cooldown++;
                socket.emit("StoreXY", ArrayPlayer[0].posX, ArrayPlayer[0].posY)

                
        });


        eventBus.on("DrawThis", function(X,Y)
        {

                canvas.context.fillStyle = "red";
                canvas.context.fillRect(X, Y, 15, 15);
            

        });
            eventBus.on("shoot", function(id){
            eventBus.emit('missile',ArrayPlayer[id].posX,ArrayPlayer[id].posY,ArrayPlayer[id].LastMove, 5,canvas)
        })
    });


});