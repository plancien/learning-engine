/*

@name 
    [TEST] Perlin 
@endName

@description
    Testing game for the perlin noise module.
@endDescription

*/

define([
    'event_bus',
    'modules/tools',
    'modules/canvas',
    'modules/frames'
], function(eventBus, Tools, Canvas, Frames) {

    var canvas = Canvas.create();

    // initialize three seed to compute perlin
    var x = 1;
    var y = Math.random() * 1000;
    var z = 100000;

    // initialize a dot to a random position (compute with perlin)
    var dot = {
        x: Tools.maths.map_range(Tools.random.perlin.noise(x, y, z), 0, 1, 0, canvas.canvas.width),
        y: Tools.maths.map_range(Tools.random.perlin.noise(y, x, z), 0, 1, 0, canvas.canvas.height)
    };

    eventBus.on("new frame", function() {
        // change dot position on each frame, new position compute with perlin
        var newX = Tools.maths.map_range(Tools.random.perlin.noise(x, y, z), 0, 1, 0, canvas.canvas.width);
        var newY = Tools.maths.map_range(Tools.random.perlin.noise(y, x, z), 0, 1, 0, canvas.canvas.height);

        // redefine position
        dot = {
            x: newX,
            y: newY
        };

        // drawing dot
        canvas.context.fillStyle = "blue";
        canvas.context.beginPath();
        canvas.context.arc(dot.x, dot.y, 5, 0, 2 * Math.PI, false);
        canvas.context.fill();

        // modifying seeds smoothely to smoothely change perlin results
        x += 0.01;
        y += 0.01;
        z += 0.01;
    });

});
