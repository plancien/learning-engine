define(['event_bus','modules/frames'], function(eventBus, frames){

        var socket = io.connect('http://localhost:8075');
        
        var ArrayShoot = [];

        var theCanvas;

        var Missile = function(X,Y,direction, speed,canvas)
        {

            this.X = X;
            this.Y = Y;
            this.direction = direction;
            this.speed = speed;
            this.lifetime = 0
        }

    socket.on('collision complete', function (IdPlayer, IdShoot)
    {
        ArrayShoot.splice(IdShoot,1);
    });

    eventBus.on('missile', function (X,Y,direction, speed,canvas) {

        if (direction == 1)
        {
            var X = X - 20;
            var Y = Y + 5;
        }
        if (direction == 2)
        {
            var X = X + 20;
            var Y = Y + 5;
        }
        if (direction == 3)
        {
            var X = X + 5;
            var Y = Y - 20;
        }
        if (direction == 4)
        {
            var X = X + 5;
            var Y = Y + 20;
        }

        ArrayShoot.push(new Missile(X,Y,direction, speed,canvas))

    });
        eventBus.on("DrawThat", function(canvas, player)
        {
            theCanvas = canvas;
            socket.emit('infodeCollision', ArrayShoot, player);


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

                //canvas.context.fillStyle = "rgb(0,253,0)";
                //canvas.context.fillRect(ArrayShoot[i].X,ArrayShoot[i].Y, 5, 5);

                if (ArrayShoot[i].lifetime>100)
                {
                    ArrayShoot.splice(i,1);
                }
            }
            socket.emit('tir', ArrayShoot);


            });

            socket.on('afficheTir', function (tab)
            {
                for (var i = 0; i < tab.length; i++)
                {
                    theCanvas.context.fillStyle = "rgb(0,253,0)";
                    theCanvas.context.fillRect(tab[i].X,tab[i].Y, 5, 5);
                }
            });
});