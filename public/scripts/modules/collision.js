define(['event_bus'], function(eventBus)
{
	var socket = io.connect('http://localhost:8075');
	var arrayPlayer = [];
	var arrayShoot = [];

	socket.on('testCollision', function (shoot, player)
	{
		arrayPlayer[player.id-1] = player;
		arrayShoot[player.id-1] = shoot;

		
		for (var i = 0; i < arrayPlayer.length ; i++)
			{
				for (var j = 0; j < arrayShoot.length ; j++)
				{
					for (var k = 0; k < arrayShoot[j].length ; k++)
					{
						if (arrayShoot[j][k].X < arrayPlayer[i].x+20 && arrayShoot[j][k].X > arrayPlayer[i].x && arrayShoot[j][k].Y < arrayPlayer[i].y+20 && arrayShoot[j][k].Y > arrayPlayer[i].y)
						{
							socket.emit("collision", i, j, k);
						}
					}
				}
			}
	});
});