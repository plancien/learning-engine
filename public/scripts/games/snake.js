/*

@name 
    Snake Game 
@endName

@description
    The classic Snake game.
@endDescription

*/

define([
    'event_bus',
    'modules/window_size',
    'modules/canvas'
], function (eventBus, WindowSize, Canvas) {

    //var canvas = Canvas.create('canvasId');

    var taille = WindowSize.getWindowSize();

    var params = {
        width: taille.width,
        height: taille.height
    }

    var canvas = Canvas.create(params);
    var context = canvas.context;
    
    context.fillStyle = "#000000";
    context.fillRect(0, 0, taille.width-200, taille.height-200);
    
    window.onresize = function () {
        context.clearRect(0, 0, taille.width, taille.height)
        taille = WindowSize.getWindowSize();
        context.fillStyle = "#000000";
        context.fillRect(0, 0, taille.width-200, taille.height-200);
    };

     function gameLoop () {
        setTimeout(gameLoop, 200 + Math.random()*300);
    }
});
