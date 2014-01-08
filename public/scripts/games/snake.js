/*

@name 
    Snake Game 
@endName

@description
    The classic Snake game.
@endDescription

*/

define([
    'event_bus',
    'modules/window_size',
    'modules/canvas',
    'modules/score',
    'modules/sound'
], function (eventBus, WindowSize, Canvas) {

    eventBus.emit("add sound" , true, 'sounds/daft_punk.mp3',true);

    var taille = WindowSize.getWindowSize();

    var params = {
        width: taille.width,
        height: taille.height
    }

    var canvas = Canvas.create(params);
    var ctx = canvas.context;

    if(taille.height > 600)
        taille.height = 600;

    if(taille.width > 800)
        taille.width = 800;

    var h = taille.height;
    var w = taille.width;

    var cw = 10;
    var d;
    var food;
    var badFood;
    
    var snake_array;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, taille.width-200, taille.height-200);
    
    window.onresize = function () {
        ctx.clearRect(0, 0, w, h);
        taille = WindowSize.getWindowSize();
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, taille.width-200, taille.height-200);
        w = 800;
        h = 800;
    };

    
    function init() {
        d = "right";
        create_snake();
        create_food();
        create_badFood();

        score = 0;
        
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }

    init();
    
    function create_snake() {
        var length = 5; 
        snake_array = [];
        for(var i = length-1; i>=0; i--) {
            snake_array.push({x: i, y:0});
        }
    }
    
    function create_food() {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        };
    }

    function create_badFood() {
        badFood = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        };
    }
    
    function paint() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        var nx = snake_array[0].x;
        var ny = snake_array[0].y;

        if(d == "right") nx++;
        else if(d == "left") nx--;
        else if(d == "up") ny--;
        else if(d == "down") ny++;

        if(nx >= w)
            nx = w/4;
        
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)) {
            init();
            return;
        }

        if(nx == food.x && ny == food.y) {
            var tail = {x: nx, y: ny};

            eventBus.emit('add points', 1);

            create_food();
        } else {
            var tail = snake_array.pop();
            tail.x = nx; tail.y = ny;
        }


        if(nx == badFood.x && ny == badFood.y) {

            eventBus.emit('add points', -3);

            create_badFood();
        }
                
        snake_array.unshift(tail);
        
        for(var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];

            paint_cell(c.x, c.y);
        }
        

        paint_cell(food.x, food.y);
        paint_badCell(badFood.x, badFood.y);
    }
    
    function paint_badCell(x, y) {
        ctx.fillStyle = "red";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function paint_cell(x, y) {
        ctx.fillStyle = "green";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }
    
    function check_collision(x, y, array) {

        for(var i = 0; i < array.length; i++) {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }

    $(document).keydown(function(e) {
        var key = e.which;

        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
    })    
});
