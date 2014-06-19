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
    'modules/game_win',
    'modules/bonus_chooser',
    'modules/bonus_fader',
    "modules/img_loader",
    "modules/load_bonus",
    "modules/resize_img",
    "ext_libs/randomColor"
], function(eventBus, 
            canvasCreate, 
            score, 
            frames, 
            keyListener, 
            Render, 
            tools, 
            mouse, 
            particles, 
            Gauge,
            color,
            game_over,
            game_win,
            bonus_chooser,
            bonus_fader,
            imgLoad,
            loadBonus,
            resizeImg,
            randomColor
        ) {

    return function(params) {
        var canvas, ctx = null;

        var callBonuses = 0;
        var paramsCanvas = {
            id: "learningShooter",
            width: 800,
            height: 600
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

        var bonusNames = loadBonus(params.bonus);
        var malusNames = loadBonus(params.malus);
        var imgs = []

        eventBus.on('init', function() {
            imgs = imgLoad({},function() {

                for (var i = bonusNames.length - 1; i >= 0; i--) {
                    imgs[bonusNames[i]] = resizeImg(imgs[bonusNames[i]],96,96,"fit");
                };

                for (var i = malusNames.length - 1; i >= 0; i--) {
                    imgs[malusNames[i]] = resizeImg(imgs[malusNames[i]],96,96,"fit");
                };

                particles();
                eventBus.emit('need new bonus');
                canvas = canvasCreate.create(paramsCanvas);
                canvas.canvas.style.backgroundImage = "url(images/sprites/pikachuParallax.png)"
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
                        y: 400
                    },
                    valueMax: 3000
                });
                createAnswers();

                eventBus.on("new frame", function() {
                    drawBackground();
                    updateBonus();
                    colliderObject(); //Mouse - Object collision
                    updateGauge();
                    
                    for (var j = 0; j < gameContainer.arrayAnswer.length; j++) {
                        updateAnswer(gameContainer.arrayAnswer[j]);
                    }
                },null,100);
            });
        });

        

        /***************************************************************************************
         * MAIN LOOP
         ***************************************************************************************/
        
        /***************************************************************************************
         * CREATING THE PATTERN FOR THE ANSWERS
         It's not dry, but i didn't find any possibility to pass dinamycly the path of the images, and know wich is the good or bad image.
        ***************************************************************************************/

        function drawBackground() {
            ctx.fillStyle = "black";
            ctx.clearRect(0, 0, paramsCanvas.width, paramsCanvas.height);
        }

        function updateBonus() {
            callBonuses++;
            if (callBonuses % 180 === 0) {
                createAnswers();
            }
        }

        function updateGauge() {
            gameContainer.gauge.currentValue--;
            if (gameContainer.gauge.currentValue <= 0 && !gameContainer.end) {
                console.log("hey");
                gameContainer.end = true;
                if (gameContainer.scoreEnd >= 0){
                    eventBus.emit('win');
                }
                if (gameContainer.scoreEnd < 0){
                    eventBus.emit('gameover');
                }
            }
        }

        function updateAnswer(answer) {
            answer.update();

            if (answer.y > 800) {
                var point = 0;
                if (answer.answer === "good"){
                    point -= 10;
                }
                destroyAnswer(answer, point);

            }
        }


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
                gameContainer.answer = new FallingAnswer(paramsAnswer);
                eventBus.emit('init render', {
                    object: gameContainer.answer,
                    sprite: {
                        x: 0,
                        y: 0,
                        width: 96,
                        height: 96,
                        img: imgs[bonusNames[(Math.random()*bonusNames.length)|0]]
                    }
                });
                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
            }
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
                gameContainer.answer = new FallingAnswer(paramsBadAnswer);
                eventBus.emit('init render', {
                    object: gameContainer.answer,
                    sprite: {
                        x: 0,
                        y: 0,
                        width: 96,
                        height: 96,
                        img: imgs[malusNames[(Math.random()*malusNames.length)|0]]
                    }
                });

                var answerArray = gameContainer.arrayAnswer.push(gameContainer.answer);
            }
        }

        function showParticle(answer) {
            var color = randomColor()
            var params = {
                x: answer.x,
                y: answer.y,
                color : color,
                count : 50,
                lifetime : 60,
            }
            eventBus.emit('CreateParticles', params);
        }


        function destroyAnswer(answer, point) {
            point = point || 0;
            showParticle(answer)
            eventBus.emit('add points', point);
            gameContainer.scoreEnd += point;
            gameContainer.arrayAnswer.splice(gameContainer.arrayAnswer.indexOf(answer), 1);
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
                    if (distance < 30 && mousePos.isClicking.left) {
                        var points = 0;
                        if (gameContainer.arrayAnswer[i].answer === "good"){
                            points += 5;
                        }
                        else {
                            points -= 10;
                        }
                        destroyAnswer(gameContainer.arrayAnswer[i],points);
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
