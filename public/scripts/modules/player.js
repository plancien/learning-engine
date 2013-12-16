define(['event_bus'], function (eventBus) {

	function Player(x, y, width, height, life, hitboxDistance, damageDeal, speed)
	{
		this.x = x;
		this.y = y;
		this.life = life;
		this.width = width;
		this.height	= height;
		this.hitboxDistance = hitboxDistance;
		this.damageDeal = damageDeal;
		this.speed = speed;
	}

	eventBus.on('init player', function (object, x, y, width, height, life, hitboxDistance, damageDeal, speed) {
		object.push(new Player(x, y, width, height, life, hitboxDistance, damageDeal, speed));
    });
});