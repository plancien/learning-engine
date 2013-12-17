define([
    'event_bus',
    'modules/tools',
    'modules/canvas',
    'modules/frames',
], function (eventBus, Tools, Canvas, Frames) {

    var canvas = Canvas.create();
    var x = 1;
    var y = 1000;
    var z = 100000;
    var dot = {
        x : Tools.maths.map_range(Tools.random.perlin.noise(x, y, z), 0, 1, 0, canvas.canvas.width),
        y : Tools.maths.map_range(Tools.random.perlin.noise(y, x, z), 0, 1, 0, canvas.canvas.height)
    }


    eventBus.on("new frame", function(){
        var newX = Tools.maths.map_range(Tools.random.perlin.noise(x, y, z), 0, 1, 0, canvas.canvas.width);
        var newY = Tools.maths.map_range(Tools.random.perlin.noise(y, x, z), 0, 1, 0, canvas.canvas.height);

        dot = {
            x : newX,
            y : newY
        };

        canvas.context.fillStyle = "blue";
        canvas.context.beginPath();
        canvas.context.arc(dot.x, dot.y, 5, 0, 2 * Math.PI, false);
        canvas.context.fill();

        x+=0.01;
        y+=0.01;
        z+=0.01;
    })
});
