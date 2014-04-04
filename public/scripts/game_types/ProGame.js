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
    'modules/canvas',
    'modules/frames',
    'modules/render',
    'modules/mouse',
    'modules/particle_generator',
    'modules/key_listener',
], function(eventBus, canvasCreate, frames, render, mouse, particles, keyListner){

    return function(params) {
        var canvas, ctx;
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
//-----------------------------------------------
//                     INIT
//-----------------------------------------------
        eventBus.on('init', function() {
            particles();
            canvas = canvasCreate.create(paramsCanvas);
            ctx = canvas.context;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);

            eventBus.on("key pressed", function(keycode) {
                console.log(keycode)
            });
        });
//-----------------------------------------------
//                     MAIN LOOP
//-----------------------------------------------

        eventBus.on("new frame", function() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
            eventBus.emit('CreateParticles', {x : mousePos.x,y : mousePos.y,size : 5,style : false,lifeTime : 100,count:20,speed : 4,angle : -0.5,color : 'red',});
        });
//-----------------------------------------------
//                     OTHERS
//-----------------------------------------------

        eventBus.on('mouse update', function(data) {
            mousePos.x = data.x;
            mousePos.y = data.y;
            mousePos.isClicking = data.isClicking;
        });
    };
});
