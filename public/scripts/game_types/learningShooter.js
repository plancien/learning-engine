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
        var canvas;

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
                canvas = canvasCreate.create(paramsCanvas);
                canvas.canvas.style.backgroundImage = "url(images/sprites/pikachuParallax.png)"
                
                initGauge();
                
                createAnswers();

                eventBus.on("new frame", function() {
                    drawBackground();
                    waitToCreateNewBonus();
                    testClickOnAnswer(); //Mouse - Object collision
                    updateGauge();
                    
                    for (var j = 0; j < gameContainer.arrayAnswer.length; j++) {
                        updateAnswer(gameContainer.arrayAnswer[j]);
                    }
                },null,100);
            });
        });

        function initGauge() {
            gameContainer.gauge = new Gauge({
                context: canvas.context,
                size: {
                    x: 100,
                    y: 600
                },
                position: {
                    x: 700,
                    y: 000
                },
                valueMax: 3000
            });
        }


        function drawBackground() {
            canvas.context.fillStyle = "black";
            canvas.context.clearRect(0, 0, paramsCanvas.width, paramsCanvas.height);
        }

        function waitToCreateNewBonus() {
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
                answer.exitScreen()
            }
        }


        function createAnswers() {
            for (var i = 0; i < 3; i++) {
                gameContainer.arrayAnswer.push( new FallingAnswer("good") );
                gameContainer.arrayAnswer.push( new FallingAnswer("bad")  );
            }
        }

        function showParticle(answer) {
            eventBus.emit('CreateParticles', {
                x: answer.x,
                y: answer.y,
                color : randomColor(),
                count : 50,
                lifetime : 60,
            });
        }

        function destroyAnswer(answer, point) {
            point = point || 0;
            showParticle(answer)
            eventBus.emit('add points', point);
            gameContainer.scoreEnd += point;
            gameContainer.arrayAnswer.splice(gameContainer.arrayAnswer.indexOf(answer), 1);
        }

        function FallingAnswer(type,x,y) {
            this.x = x || (Math.random()*600+50);
            this.y = y || (-Math.random()*200);
            this.rotation = Math.random() * 4;
            this.radius = 40;
            this.width = 40;
            this.height = 40;
            this.speed = Math.round(Math.random() * 3) + 1;
            this.image = gameContainer.imageGood;
            this.answer = type;

            this.render = function () {};
            this.move = function () {
                this.y += this.speed;
            };
            this.update = function () {
                this.move();
                eventBus.emit('render object', this, canvas.context);
            };
            this.click = function () {
                var points = 0;
                if (this.answer === "good"){
                    points += 5;
                }
                else {
                    points -= 10;
                }
                destroyAnswer(this,points);
            }
            this.exitScreen = function () {
                var point = 0;
                if (this.answer === "good"){
                    point -= 10;
                }
                destroyAnswer(this, point);
            }

            var imgsName = this.answer === "good" ? bonusNames : malusNames;
            eventBus.emit('init render', {
                object: this,
                sprite: {
                    x: 0,
                    y: 0,
                    width: 96,
                    height: 96,
                    img: imgs[imgsName[(Math.random()*imgsName.length)|0]]
                }
            });
        }

        /***************************************************************************************
         * Bonus/malus falling from the "sky"
         ***************************************************************************************/

        function testClickOnAnswer() {
            for (var i = 0; i < gameContainer.arrayAnswer.length; i++) {
                if (gameContainer.arrayAnswer[i] != undefined) {
                    var distance = tools.vectors.getDistance(gameContainer.arrayAnswer[i], mousePos);
                    if (distance < 30 && mousePos.isClicking.left) {
                        gameContainer.arrayAnswer[i].click();
                    }
                }
            }
        }
        
        eventBus.on('mouse update', function(data) {
            mousePos.x = data.canvasX;
            mousePos.y = data.canvasY;
            mousePos.isClicking = data.isClicking;
        });

        var bonusPoints = params.bonusPoints || 1;
        var malusPoints = params.malusPoints || -3;
    };
});
