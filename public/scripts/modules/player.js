define(['event_bus'], function (eventBus) {

	function Player(x, y, width, height, life, hitboxDistance, damageDeal)
	{
		this.x = x;
		this.y = y;
		this.life = life;
		this.width = width;
		this.height	= height;
		this.hitboxDistance = hitboxDistance;
		this.damageDeal = damageDeal;
	}

	eventBus.on('create a player', function (players, x, y, width, height, life, hitboxDistance, damageDeal) {
		players.push(new Player(x, y, width, height, life, hitboxDistance, damageDeal));
    });
});