/*

@name 
    Learning shooter
@endName

@description
    Click on the bad  images before they hit the floor ! The good images give you point if they hit the floor, or if you clicked on them ! Have fun while learning !
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/score',
    'modules/frames',
    'modules/key_listener',
    'modules/render',
    'modules/tools',
    'modules/mouse',
    'modules/particle_generator',
    'modules/gauge',
    'modules/color',
    'modules/game_over',
    'modules/win',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function(eventBus, canvasCreate, score, frames, keyListener, Render, tools, mouse, particles, Gauge) {

    return function(params) {
        var canvas, ctx = "";

        var callBonuses = 0;
        var paramsCanvas = {
            id: "learningShooter",
            width: 800,
            height: 800
        };

        var mousePos = {
            x: 0,
            y: 0,
            isClicking: {}
        };

        var gameContainer = {
            answer: {},
            key: "",
            arrayArrows: [],
            arrayAnswer: [],
            points: 0,
            colorParticles: 'RGB(255,0,0);',
            gauge: {},
            imageGood: new Image(),
            imageBad: new Image(),
            end: false,
            scoreEnd: 0
        };

        eventBus.on('init', function() {
            particles();
            eventBus.emit('need new bonus');
            canvas = canvasCreate.create(paramsCanvas);
            ctx = canvas.context;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);

            gameContainer.gauge = new Gauge({
                context: ctx,
                size: {
                    x: 100,
                    y: 200
                },
                position: {
                    x: 700,
                    y: 600
                },
                valueMax: 3000
            });
            createAnswers();
        });

        /***************************************************************************************
         * MAIN LOOP
         ***************************************************************************************/
        eventBus.on("new frame", function() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, paramsCanvas.width, paramsCanvas.height);
            //Collider beetween the mouse and the objects
            colliderObject();

            gameContainer.gauge.currentValue--;

            if (gameContainer.gauge.currentValue <= 0 && !gameContainer.end) {
                gameContainer.end = true;
                if (gameContainer.scoreEnd >= 0){
                    eventBus.emit('win');
                }
                if (gameContainer.scoreEnd < 0){
                    eventBus.emit('gameover');
                }
            }

            callBonuses++;
            if (callBonuses % 180 === 0) {
                createAnswers();
            }

            for (var j = 0; j < gameContainer.arrayAnswer.length; j++) {
                gameContainer.arrayAnswer[j].update();
                if (gameContainer.arrayAnswer[j].y > 800) {
                    if (gameContainer.arrayAnswer[j].answer === "good"){
                        gameContainer.points -= 10;
                    }

                    eventBus.emit('number random color', 1, 255, 255, 0, false);
                    eventBus.on('random color', function(data) {
                        gameContainer.colorParticles = data;
                    });
                    var params = {
                        x: gameContainer.arrayAnswer[j].x,
                        y: gameContainer.arrayAnswer[j].y,
                        color : gameContainer.colorParticles,
                        count : 200,
                        lifetime : 60,
                    }
                    eventBus.emit('CreateParticles', params);
                    eventBus.emit('add points', gameContainer.points);
                    gameContainer.scoreEnd += gameContainer.points;
                    gameContainer.points = 0;
                    gameContainer.arrayAnswer.splice(j, 1);
                }
            }
        });

        /***************************************************************************************
         * CREATING THE PATTERN FOR THE ANSWERS
         It's not dry, but i didn't find any possibility to pass dinamycly the path of the images, and know wich is the good or bad image.
         ***************************************************************************************/

        function createAnswers() {
            for (var i = 0; i < 3; i++) {
                var paramsAnswer = {
                    x: Math.round(Math.random() * 700),
                    y: Math.round(Math.random() * 100),
                    width: 80,
                    height: 80,
                    speed: Math.round(Math.random() * 3) + 1,
                    answer: "good"
                };
                gameContainer.imageGood.src = params.bonusUrl;
                gameContainer.answer = new FallingAnswer(paramsAnswer);
                eventBus.emit('init render', {
                    object: gameContainer.answer,
                    sprite: {
                        x: 0,
                        y: 0,
                        width: 96,
                        height: 96,
                        img: gameContainer.imageGood
                    }
                });
                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
            }
            console.log(params.bonusUrl);
            createBadAnswer();
        }

        function createBadAnswer() {
            for (var i = 0; i < 3; i++) {
                var paramsBadAnswer = {
                    x: Math.round(Math.random() * 700),
                    y: Math.round(Math.random() * 100),
                    width: 80,
                    height: 80,
                    speed: Math.round(Math.random() * 3) + 1,
                    answer: "bad"
                };

                gameContainer.imageBad.src = params.malusUrl;
                gameContainer.answer = new FallingAnswer(paramsBadAnswer);
                eventBus.emit('init render', {
                    object: gameContainer.answer,
                    sprite: {
                        x: 0,
                        y: 0,
                        width: 96,
                        height: 96,
                        img: gameContainer.imageBad
                    }
                });

                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
            }
        }

        /***************************************************************************************
         * Bonus/malus falling from the "sky"
         ***************************************************************************************/

        function FallingAnswer(params) {
            this.x = params.x;
            this.y = params.y;
            this.rotation = Math.random() * 4;
            this.radius = params.height / 2;
            this.width = this.radius;
            this.height = this.radius;
            this.speed = params.speed;
            this.image = gameContainer.imageGood;
            this.answer = params.answer;


            this.render = function render() {};

            this.move = function move() {
                this.y += this.speed;
            };

            this.update = function update() {
                this.move();
                eventBus.emit('render object', this, ctx);
            };
        }

        /***************************************************************************************
         * Bonus/malus falling from the "sky"
         ***************************************************************************************/

        function colliderObject() {
            for (var i = 0; i < gameContainer.arrayAnswer.length; i++) {
                if (gameContainer.arrayAnswer[i] != undefined) {
                    var distance = tools.vectors.getDistance(gameContainer.arrayAnswer[i], mousePos);

                    if (distance < 80 && mousePos.isClicking.left) {
                        if (gameContainer.arrayAnswer[i].answer === "good"){
                            gameContainer.points += 5;
                        }
                        else {
                            gameContainer.points -= 10;
                        }

                        eventBus.emit('number random color', 1, 255, 255, 0, false);
                        eventBus.on('random color', function(data) {
                            gameContainer.colorParticles = data;
                        });
                        var params = {
                            x: mousePos.x,
                            y: mousePos.y,
                            color : gameContainer.colorParticles,
                            count : 200,
                            lifetime : 60,
                        }
                        eventBus.emit('CreateParticles', params);
                        eventBus.emit('add points', gameContainer.points);
                        gameContainer.scoreEnd += gameContainer.points;
                        gameContainer.points = 0;
                        gameContainer.arrayAnswer.splice(i, 1);
                    }
                }
            }
        }
        
        eventBus.on('mouse update', function(data) {
            mousePos.x = data.canvasX;
            mousePos.y = data.canvasY;
            mousePos.isClicking = data.isClicking;
        });

        eventBus.on('keys still pressed', function(data) {
            gameContainer.key = data;
        });

        var bonusPoints = params.bonusPoints || 1;
        var malusPoints = params.malusPoints || -3;

        eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true, params.malusUrl);
    };
});
