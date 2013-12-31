/*

@name 
   [TEST] Shooter 
@endName

@description
    Learn with fun
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/shoot',
    'modules/playerShooter',
    'modules/frames'
], function (eventBus, Canvas, shoot) { 

	eventBus.on("new frame", function()
        {
            canvas.context.clearRect(0,0,1200,1200);
            eventBus.emit('dat new frame',canvas);
        });

    var canvas = Canvas.create();

    eventBus.emit('new player', 5, 5, 300, 100,canvas);
});