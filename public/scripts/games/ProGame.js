/*

@name 
    Progame
@endName

@description
    Progame
@endDescription

*/

define([
    'event_bus',
    'modules/canvas'
], function(eventBus, canvasCreate){

    return function(params) {
        var canvas, ctx = "";

        var callBonuses = 0;
        var paramsCanvas = {
            id: "Progame",
            width: 800,
            height: 800
        };

        var mousePos = {
            x: 0,
            y: 0,
            isClicking: {}
        };

        var gameContainer = {
        };

        eventBus.on('init', function() {
            canvas = canvasCreate.create(paramsCanvas);
            ctx = canvas.context;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
        });
    };
});
