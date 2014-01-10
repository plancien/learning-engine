define(['event_bus','modules/frames','modules/key_listener', 'modules/game_over'], function(eventBus, frames){

        var socket = io.connect('http://localhost:8075');
        var ArrayPlayer = [];
        var img = new Image();
        var wait = 1001;
        var type = false;

        var Player = function(life, speed, x, y,id)
        {
            this.id = id
            this.life = life;
            this.speed = speed;
            this.x = x;
            this.y = y;
            this.LastMove = 1;
            this.cooldown = 0;
        }

    eventBus.on('new player', function (life, speed, x, y,canvas,id, image) {
            
        ArrayPlayer.push(new Player(life, speed, x, y,id, image))
            eventBus.on("keys still pressed", function(keys)
            {

                for (var i = 0; i < keys.length; i++) 
                {
                    
                    if(keys[i] == 81)
                    {
                        ArrayPlayer[0].x -= ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 1;
                    }   
                    else if(keys[i] == 68)
                    {
                        ArrayPlayer[0].x += ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 2;
                    }   
                    else if(keys[i] == 90)
                    {
                        ArrayPlayer[0].y -= ArrayPlayer[0].speed;
                        ArrayPlayer[0].LastMove = 3;
                    }   
                    else if(keys[i] == 83)
                    {
                        ArrayPlayer[0].y += ArrayPlayer[0].speed;
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
                socket.emit("StoreXY", ArrayPlayer[0].x, ArrayPlayer[0].y, ArrayPlayer[0])

                
        });

        eventBus.on("DrawThis", function(X,Y,width,height, url, good)
        {
            wait++;
            if (wait>1000) 
            {
                type = good;
                eventBus.emit("type", type);
                img = new Image();
                img.src = url;
                img.onload = function()
                {
                    canvas.context.drawImage(img, X, Y, width, height);
                }
                wait = 0;
            }
            else
            {
                canvas.context.drawImage(img, X, Y, width, height);
            }
        });
            eventBus.on("shoot", function(id){
                if (type == true)
                {
                    eventBus.emit('missile',ArrayPlayer[id].x,ArrayPlayer[id].y,ArrayPlayer[id].LastMove, 5,canvas)
                }
        });
        eventBus.on("onDamage", function(damage){
            ArrayPlayer[0].life -= damage;
            if(ArrayPlayer[0].life <= 0){
                eventBus.emit("gameover");
            }
        })
    });


});