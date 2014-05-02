
define([
    'event_bus',
    'modules/simpleWall'
], function(eventBus, wall) { // init,
//Initialisation des elements du jeu
    wall.create(1100, 1400, 600, 30, config.wallColor);
    wall.create(1600, 100, 10000, 700, config.wallColor);
    wall.create(850, 0, 60, 1600, config.wallColor);
    wall.create(850, 1600, 20000, 60, config.wallColor);
    element.create(1600, 1350, 50, 50, "bonus");
});