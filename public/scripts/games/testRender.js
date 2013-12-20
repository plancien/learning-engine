/*

@name 
    [TEST] Render 
@endName

@description
    Testing game for the render module.
@endDescription

*/

define([
    'event_bus',
    'modules/render',
    'modules/canvas',
    'modules/frames'
        ], function (eventBus, Render, Canvas, frames) {


    var canvas = Canvas.create();

    //fake object who will obtain the render method
    var Test = function(){
        this.x = 200;
        this.y = 150;
    };

    //all the params you will need to animate the sprite
    var params = 
    {   
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
        //I clear the canvas here because we don't have a loop with a lot of things rendered
        canvas.context.clearRect(player.x-(player.width/2),player.y-(player.height/2),player.width,player.height);
        player.animate();
        player.render();
    });

});