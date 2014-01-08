define(['event_bus','modules/frames'], function(eventBus, frames){

        
        var ArrayShoot = [];

        var Missile = function(X,Y,direction, speed,canvas)
        {
            this.X = X;
            this.Y = Y;
            this.direction = direction;
            this.speed = speed;
            this.lifetime = 0
        }

    eventBus.on('missile', function (X,Y,direction, speed,canvas) {
        ArrayShoot.push(new Missile(X,Y,direction, speed,canvas))

    });
        eventBus.on("DrawThat", function(canvas)
        {
            for (var i = 0; i < ArrayShoot.length; i++)
            {
                ArrayShoot[i].lifetime ++;

                if (ArrayShoot[i].direction == 1)
                {
                    ArrayShoot[i].X-=ArrayShoot[i].speed;
                }
                else if (ArrayShoot[i].direction == 2)
                {
                    ArrayShoot[i].X+=ArrayShoot[i].speed;
                }
                else if (ArrayShoot[i].direction == 3)
                {
                    ArrayShoot[i].Y-=ArrayShoot[i].speed;
                }
                else if (ArrayShoot[i].direction == 4)
                {
                    ArrayShoot[i].Y+=ArrayShoot[i].speed;
                }
                canvas.context.fillStyle = "rgb(0,253,0)";
                canvas.context.fillRect(ArrayShoot[i].X,ArrayShoot[i].Y, 5, 5);

                if (ArrayShoot[i].lifetime>100)
                {
                    ArrayShoot.splice(i,1);
                }
            }

        });

});