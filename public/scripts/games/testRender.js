define([
    'event_bus',
    'modules/render',
    'modules/canvas',
    'modules/frames'
        ], function (eventBus, Render, Canvas, frames) {


    var canvas = Canvas.create();

    //fake object who will obtain the render method
    var Test = function(){};

    //all the params you will need to animate the sprite
    var params = 
    {   
        x : 200,
        y : 100,
        spritesheet     : 'images/pupil1.png',
        nb_of_frame     : 4,
        currentFrameX   : 0,
        currentFrameY   : 0,
        frameWidth      : 48,
        frameHeight     : 48,
        width           : 48,
        height          : 48
    }

    var player = new Test();

    //we call the render method, with the context, the object, and the params 
    eventBus.emit("init render", canvas.context,player,params);

    //game loop
    eventBus.on("new frame", function(){
        player.animate();
        player.render();
    });

});