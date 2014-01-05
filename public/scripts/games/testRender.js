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



    eventBus.on('images loaded', function (images) {

        var canvas = Canvas.create();

        //fake object who will obtain the render method
        var Test = function(params){
            this.x = params.x;
            this.y = params.y;
            this.width = 48;
            this.height = 48;
        };

        //A nonanimated sprite
        var fixPlayer = new Test({x : 150, y : 200});
        //An animated Sprite
        var movingPlayer = new Test({x : 255, y : 100});
        //An animated and rotated sprite
        var rotatedMovingPlayer = new Test({x : 52, y : 230});
        rotatedMovingPlayer.rotation = 0.5;
        //A pattern sprite
        var pattern = new Test({x : 50, y : 50});
        pattern.height = 100;
        pattern.width = 100;
        //A rotated patter sprite
        var rotatedPattern = new Test({x : 150, y : 200});
        rotatedPattern.rotation = 0.8;
        rotatedPattern.width = 150;
        rotatedPattern.height = 50;


        //An exemple of animation structure
        var goDownAnimation = {
                                name : "goDown",
                                sprites : [
                                    {x : 0, y : 0, width : 48, height : 48},
                                    {x : 48, y : 0, width : 48, height : 48},
                                    {x : 96, y : 0, width : 48, height : 48},
                                    {x : 144, y : 0, width : 48, height : 48},
                                ] 
                            };

        //The render initialisations
        eventBus.emit("init render", {object : fixPlayer,
                                      sprite : {x : 0, y : 0, width : 48, height : 48, img : images['pupil1']}});
        eventBus.emit("init render", {object : pattern,
                                          sprite : {x : 0, y : 0, width : 48, height : 48, img : images['+']},
                                          patternRepeat : "repeat"
                                      });
        eventBus.emit("init render", {object : rotatedPattern,
                                          sprite : {x : 0, y : 0, width : 48, height : 48, img : images['+']},
                                          patternRepeat : "repeat-x",
                                          rotating : true
                                      });
        eventBus.emit("init render", {object : movingPlayer,
                                      sprite : {x : 0, y : 0, width : 48, height : 48, img : images['pupil1']}});

        eventBus.emit("init render", {object : rotatedMovingPlayer,
                                      sprite : {x : 0, y : 0, width : 48, height : 48, img : images['pupil1']},
                                      rotating : true
                                    });

        //Add animations to animated sprites
        eventBus.emit("add animation", movingPlayer,goDownAnimation);
        
        eventBus.emit("add animation", rotatedMovingPlayer,goDownAnimation);

        //game loop
        eventBus.on("new frame", function (){
            //I clear the canvas here because we don't have a loop with a lot of things rendered
            canvas.context.clearRect(0,0,canvas.canvas.width, canvas.canvas.height);
            eventBus.emit("render object",pattern,canvas.context)
            eventBus.emit("render object",rotatedPattern,canvas.context)
            eventBus.emit("render object",fixPlayer,canvas.context)
            eventBus.emit("animate object",movingPlayer)
            eventBus.emit("render object",movingPlayer,canvas.context)
            eventBus.emit("animate object",rotatedMovingPlayer)
            eventBus.emit("render object",rotatedMovingPlayer,canvas.context)
        });


        //Do something at the end of the animation
        eventBus.on("animation end", function (object, anim){
            if(object === movingPlayer || rotatedMovingPlayer){
                eventBus.emit("reset animation", object);
            }
        })
    });
});