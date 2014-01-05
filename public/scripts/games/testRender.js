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


    var img = new Image();
    img.src = "./images/pupil1.png";
    var patternImage = new Image();
    patternImage.src = "./images/+.png";

    //An exemple of animation structutre
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
                                  sprite : {x : 0, y : 0, width : 48, height : 48, img : img}});
    eventBus.emit("init render", {object : pattern,
                                      sprite : {x : 0, y : 0, width : 48, height : 48, img : patternImage},
                                      patternRepeat : "repeat"
                                  });
    eventBus.emit("init render", {object : rotatedPattern,
                                      sprite : {x : 0, y : 0, width : 48, height : 48, img : patternImage},
                                      patternRepeat : "repeat-x",
                                      rotating : true
                                  });
    eventBus.emit("init render", {object : movingPlayer,
                                  sprite : {x : 0, y : 0, width : 48, height : 48, img : img}});

    eventBus.emit("init render", {object : rotatedMovingPlayer,
                                  sprite : {x : 0, y : 0, width : 48, height : 48, img : img},
                                  rotating : true
                                });

    //Add animations to animated sprites
    eventBus.emit("add animation", movingPlayer,goDownAnimation);
    
    eventBus.emit("add animation", rotatedMovingPlayer,goDownAnimation);

    //game loop
    eventBus.on("new frame", function (){
        //I clear the canvas here because we don't have a loop with a lot of things rendered
        canvas.context.clearRect(0,0,canvas.canvas.width, canvas.canvas.height);
        pattern.render(canvas.context);
        rotatedPattern.render(canvas.context);
        fixPlayer.render(canvas.context);
        movingPlayer.animate();
        movingPlayer.render(canvas.context);
        rotatedMovingPlayer.animate();
        rotatedMovingPlayer.render(canvas.context);
    });


    //Do something at the end of the animation
    eventBus.on("animation end", function (object, anim){
        if(object === movingPlayer || rotatedMovingPlayer){
            eventBus.emit("reset animation", object);
        }
    })
});