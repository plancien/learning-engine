define([], function(){
	var config = {};

	config.bonus = {};
	config.bonus.size = 60;
	config.bonus.nbFrameLife = 180;
	config.bonus.nbFramePop = 45;
	config.bonus.malusImageScore = -20;
	config.bonus.bonusImageScore = 15;
	config.bonus.percentOfBonus = 0.5;
	config.bonus.nbFrameGrow = 15;
	config.bonus.pxGrowPerFrame = 3;

	config.player = {};
	config.player.x = 400
	config.player.y = 600 - 37.5,
	config.player.width = 60;
	config.player.height = 60;
    config.player.speed = 74;

	config.player.hitbox = {};
	config.player.hitbox.offsetX = 20;
	config.player.hitbox.offsetY = 10;
	config.player.hitbox.width = 30;
	config.player.hitbox.height = 40;

	return config;
});    	