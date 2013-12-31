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
], function (eventBus, Canvas, shoot) { 

    var canvas = Canvas.create();

    eventBus.emit('missile', 200,50,1,5,canvas);
    eventBus.emit('missile', 250,100,1,5,canvas);
});