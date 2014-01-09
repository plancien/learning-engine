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
    'modules/frames',
    'modules/key_listener',
    'modules/collision',
    'modules/bonus_chooser',
    ], 
    function (eventBus, Canvas, shoot) { 

        return function(params)
    {

        eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true,  params.malusUrl);

    var socket = io.connect('http://localhost:8075');
    socket.emit('nouveau_client');

    var tabX = [];
    var tabY = [];

    
        
            socket.emit('MyID');


            socket.on('create', function (id) {

            

            eventBus.emit('new player', 5, 5, 300, 100,canvas,id);
            console.log(id);
            });

            socket.on('Update player', function (X, Y, id, player) {

            canvas.context.clearRect(0,0,1200,1200);
            
            tabX[id] = X;
            tabY[id] = Y;

            
                eventBus.emit('DrawThat', canvas, player);
                eventBus.emit("need new bonus");
            });

            eventBus.on('add bonus', function (good, url) {
                for (var i = 0; i < tabX.length; i++) 
                { 
                    eventBus.emit('DrawThis', tabX[i], tabY[i],20 ,20,url);
                }
            });
        
    

	eventBus.on("new frame", function()
        {

            eventBus.emit('dat new frame',canvas);
        });

    var canvas = Canvas.create();
}
});