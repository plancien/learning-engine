define(['event_bus'], function(eventBus)
{
    var socket = io.connect('http://localhost:8075');
    var arrayPlayer = [];
    var arrayShoot = [];

    socket.on('testCollision', function (shoot, player)
    {
        arrayPlayer = [];
        arrayShoot = [];

        for (var i = 0; i < shoot.length; i++)
        {
            arrayShoot.push(shoot[i]);
        }
        arrayPlayer.push(player);

        
        for (var i = 0; i < arrayPlayer.length ; i++)
            {
                for (var j = 0; j < arrayShoot.length ; j++)
                {
                    
                        if (arrayShoot[j].X < arrayPlayer[i].x+20 && arrayShoot[j].X > arrayPlayer[i].x && arrayShoot[j].Y < arrayPlayer[i].y+20 && arrayShoot[j].Y > arrayPlayer[i].y)
                        {
                            socket.emit("collision", i, j);
                            eventBus.emit("onDamage", 1);
                        }
                    
                }
            }
    });
});