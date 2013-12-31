/*

@name 
    [TEST] Window 
@endName

@description
    Testing game for the window module.
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
    
    window.onresize = function () {
        taille = WindowSize.getWindowSize();
        canvas.width = taille.width;
        canvas.height = taille.height;

        console.log(canvas.width);
    };
});