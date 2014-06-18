define([], function(){
    var config = {};

    config.tilesSize = 74;      //Sert pour les calcules de positionnement des bonus
    config.nbTilesColumn = 12;
    config.nbTilesLine = 8;

    config.bonus = {};
    config.bonus.size = 60;
    config.bonus.nbFrameLife = 180;
    config.bonus.nbFramePop = 35;
    config.bonus.malusImageScore = -5;
    config.bonus.bonusImageScore = 20;
    config.bonus.bonusParticleColor = "blue";
    config.bonus.malusParticleColor = "red";
    config.bonus.percentOfBonus = 0.5;
    config.bonus.nbFrameGrow = 15;
    config.bonus.pxGrowPerFrame = 3;

    config.player = {};
    config.player.x = 400;
    config.player.y = 600 - 37.5;
    config.player.width = 60;
    config.player.height = 60;
    config.player.speed = 74;

    config.player.hitbox = {};
    config.player.hitbox.offsetX = 25;
    config.player.hitbox.offsetY = 15;
    config.player.hitbox.width = 25;
    config.player.hitbox.height = 30;

    config.particle = {};
    config.particle.size = 5,
    config.particle.style = false,
    config.particle.lifeTime = 120,
    config.particle.alpha = true,
    config.particle.speed = 2,
    config.particle.count = 100,
    config.particle.angle = 0,
    config.particle.color = "red";

    return config;
});     