/*

@name 
    Breakout Game 
@endName

@description
    A Breakout Game. But here you'll learn stuff.
@endDescription

*/

define([
    'event_bus',
    'modules/window_size',
    'modules/canvas',
    'modules/particle_generator'
], function (eventBus, WindowSize, Canvas) {

window.requestAnimFrame =   (
    function()
    {
        return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element)
        {
            window.setTimeout(callback, 1000 / 60);
        };
    }
)();

//Intégration du module Window Size
var taille = WindowSize.getWindowSize();

var params = {
    width: taille.width,
    height: taille.height
}

var canvas = Canvas.create(params);
var context = canvas.context;

var h = taille.height;
var w = taille.width

window.onresize = function () {
    context.clearRect(0, 0, w, h);
    taille = WindowSize.getWindowSize();
    context.fillStyle = "#000000";
    context.fillRect(0, 0, taille.width, taille.height);
    w = taille.width;
    h = taille.height;
};

//Début script du jeu
var ballX = 440;
var ballY = 600;
var ballR = 14;
var moveX = 1.5;
var moveY = -7;
var gameOver = false;
var bricks = [];

function init() {
    draw();
    createPaddle(400, 20, 100, 10);
    createBricks(10, 20, 70, 40, 1);
}
init();

function createPaddle(paddleX, paddleHeight, paddleWidth, paddleSpeed) {
    this.paddleX = paddleX;
    this.paddleHeight = paddleHeight;
    this.paddleWidth = paddleWidth;
    this.paddleSpeed = paddleSpeed;
}

function createBricks(brickRow, brickCol, brickWidth, brickHeight, brickPadding) {
    this.brickRow = brickRow;
    this.brickCol = brickCol;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.brickPadding = brickPadding;

    bricks = new Array(brickRow);
    for (i = 0; i < brickRow; i++)
    {
        bricks[i] = new Array(brickCol);
        for (j = 0; j < brickCol; j++)
        {
            bricks[i][j] = 1;
        }
    }
}

function createCircle(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
}

function createRect(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
}

function clearCanvas()
{
    context.clearRect(0, 0, taille.width, taille.height);
}

function collisions() {
    rowHeight = this.brickHeight + this.brickPadding;
    colWidth = this.brickWidth + this.brickPadding;
    row = Math.floor(ballY/rowHeight);
    col = Math.floor(ballX/colWidth);
    if (ballY < this.brickRow * rowHeight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        moveY = -moveY;
        bricks[row][col] = 0;
        /*eventBus.emit('CreateParticles', (j * (this.brickWidth + this.brickPadding)) + this.brickPadding,
            (i * (this.brickHeight + this.brickPadding)) + this.brickPadding, "#FF0000", 10, 4);*/
    }


    if (ballX + moveX + ballR > taille.width || ballX + moveX - ballR < 0)
    {
        moveX = -moveX;
    }
    if (ballY + moveY - ballR < 0)
    {
        moveY = -moveY;
    }
    else if (ballY + moveY + ballR > taille.height-200) {
        if (ballX > this.paddleX && ballX < this.paddleX + this.paddleWidth)
        {
            moveX = 8 * ((ballX - (this.paddleX + this.paddleWidth / 2)) / this.paddleWidth);
            moveY = -moveY;
        }
        else if (ballY + moveY + ballR > taille.height-200)
        {
            gameOver = true;
        }
    }

    if (gameOver == false)
    {
        ballX += moveX;
        ballY += moveY;
    }
    else if (gameOver == true)
    {
        moveX = 0;
        moveY = 0;
    }
}

function draw() {
    clearCanvas();
    move();
    collisions();

    createCircle(ballX, ballY, ballR);
    createRect(this.paddleX, taille.height - 200 - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    for (i = 0; i < this.brickRow; i++)
    {
        for (j = 0; j < this.brickCol; j++)
        {
            if (bricks[i][j] == 1)
            {
                createRect ((j * (this.brickWidth + this.brickPadding)) + this.brickPadding,
                    (i * (this.brickHeight + this.brickPadding)) + this.brickPadding,
                    this.brickWidth, this.brickHeight);
            }
        }
    }

    requestAnimFrame(draw);
}

function move() {

    if (this.moveLeft === true) {
        paddleX -= paddleSpeed;
    }

    if (this.moveRight === true) {
        paddleX += paddleSpeed;
    }

    document.onkeydown = function (event) {
        var keyPressed = event.keyCode;
        if (keyPressed == 37) {
            moveLeft = true;
        }
        if (keyPressed == 39) {
            moveRight = true;
        }
    }

    document.onkeyup = function (event) {
        var keyUp = event.keyCode;
        if (keyUp == 37) {
            moveLeft = false;
        }
        if (keyUp == 39) {
            moveRight = false;
        }
    }
}

});
