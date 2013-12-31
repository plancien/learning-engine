define(['event_bus','modules/frames','modules/key_listener'], function(eventBus, frames){

        
        var ArrayPlayer = [];

        var Player = function(life, speed, posX, posY,colorRgb)
        {
            this.life = life;
            this.speed = speed;
            this.posX = posX;
            this.posY = posY;
            this.LastMove = 1;
            this.cooldown = 0;
            this.color = "red";
        }

    eventBus.on('new player', function (life, speed, posX, posY,canvas) {
            
        ArrayPlayer.push(new Player(life, speed, posX, posY))
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

            for (var i = 0; i < ArrayPlayer.length; i++)
            {
                ArrayPlayer[i].cooldown++;
                canvas.context.fillStyle = ArrayPlayer[i].color;
                canvas.context.fillRect(ArrayPlayer[i].posX, ArrayPlayer[i].posY, 15, 15);
            }

        });
            eventBus.on("shoot", function(id){
            eventBus.emit('missile',ArrayPlayer[id].posX,ArrayPlayer[id].posY,ArrayPlayer[id].LastMove, 5,canvas)
        })
    });


});