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
    'modules/key_listener'
], function (eventBus, Canvas, shoot) { 

    var socket = io.connect('http://localhost:8075');
    socket.emit('nouveau_client');

    
        
            socket.emit('MyID');


            socket.on('create', function (id) {
            eventBus.emit('new player', 5, 5, 300, 100,canvas,id);
            console.log(id);
            });

            socket.on('Update player', function (X, Y) {
            canvas.context.clearRect(0,0,1200,1200);
            eventBus.emit('DrawThis', X, Y);
            });

        
    

	eventBus.on("new frame", function()
        {

            eventBus.emit('dat new frame',canvas);
        });

    var canvas = Canvas.create();
});