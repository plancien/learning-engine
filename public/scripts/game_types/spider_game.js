/*

@name 
    Spider Game
@endName

@description
    You are spiderman
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/mouse',
    'modules/collisions',
    "modules/text_canvas"
], function(eventBus,canvasFactory,frames,mouse,collisions,createTextDisplay) {

    return function(params) {
        var canvas = canvasFactory.create({"width" : 400, "height" : 600});
        var ctx = canvas.context; console.log(canvas);
        var gravity = 0.001;
        var player, anchors, scrolling;
        var background = (function() {
            var canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 100*101;
            var ctx = canvas.getContext("2d");
            var gradient = ctx.createLinearGradient(0, 0, 0, 100*101);
            gradient.addColorStop(1,"#f2feff");
            gradient.addColorStop(0.7,"#bef5f4");
            gradient.addColorStop(0.3,"#6170a9");
            gradient.addColorStop(0,"#282653");
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,1,100*101);
            return canvas;
        })();

        var imgCube = loadImage("/images/sprites/cube.png");
        var imgplus = loadImage(params.bonusUrl);
        var imgmoin = loadImage(params.malusUrl);
        var text = createTextDisplay();

        //To refactor avec image Loader.

        function resetLevel() {
            anchors = [];
            scrolling = 0;
            generateLevel()
            player = {
                    x:anchors[0].x,
                    y:anchors[0].y+100,
                    vx:0,
                    vy:0,
                    linkTo: anchors[0],
                    dir: 1
            };
        }

        resetLevel();


        function updatePlayer (dt) {
            player.x += player.vx;
            player.y += player.vy;
            
            
            if (player.linkTo) {
                var dis = {
                    x:player.linkTo.x-player.x,
                    y:player.linkTo.y-player.y
                }
                var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
                var tan = {
                    x:-dis.y/length,
                    y:dis.x/length
                }
                dis.x = dis.x/length * (length-100);
                dis.y = dis.y/length * (length-100);
                player.vx += dis.x*0.001+tan.x*0.01;
                player.vy += dis.y*0.001+tan.y*0.01;
                player.vx *= 0.99;
                player.vy *= 0.99;
            } else {
                player.vy += gravity;
                
            }
        }

        function updateScrolling() {
            if (player.y < scrolling + 400) {
                scrolling = player.y-400;
                text.changeText("max : "+Math.floor((-scrolling+400)/50));
            }
            if (anchors[0]>scrolling+660) {
                anchors.shift();
            }
        }

        function draw() {
           
            //ctx.fillStyle = "black";
            //ctx.fillRect(0,0,400,600);
            //console.log(params);
            ctx.drawImage(background, 0, 100*101-600+scrolling,1,600,0,0,400,600);
            ctx.fillStyle = "red";
            if (player.linkTo) {
                ctx.strokeStyle = "#f57ad2";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(player.x,player.y - scrolling);
                ctx.lineTo(player.linkTo.x,player.linkTo.y - scrolling);
                ctx.stroke();
                if (player.vx>0) {
                    ctx.drawImage(imgCube,0,0,66,66,player.x-33,player.y-33-scrolling,66,66);
                } else {
                    ctx.drawImage(imgCube,0,66,66,66,player.x-33,player.y-33-scrolling,66,66);
                }
            } else {
                ctx.drawImage(imgCube,0,132,66,66,player.x-33,player.y-33-scrolling,66,66);
            }

            //ctx.beginPath();
            //ctx.arc(player.x,player.y - scrolling ,20,0,Math.PI*2);
            //ctx.fill();
            
            ctx.fillStyle = "blue";
            
           
            for (var i = 0; i < anchors.length; i++) {
                var file = anchors[i].good ? imgplus : imgmoin
                ctx.drawImage(file,0,0,file.width,file.height,
                              anchors[i].x-anchors[i].radius,
                              anchors[i].y-anchors[i].radius-scrolling,
                              anchors[i].radius*2,anchors[i].radius*2);
                /*ctx.beginPath();
                ctx.arc(anchors[i].x,anchors[i].y - scrolling,anchors[i].radius,0,Math.PI*2);
                ctx.globalCompositeOperation = "destination-in";
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
                debugger;
                */
            };
            ctx.drawImage(text,5,5);
            
        }

        function createAnchor(y) {
            var anchor = {
                x:Math.random()*300+50,
                y:y || Math.random()*600,
                radius: 20,
                good: Math.random()>0.5
            };
            anchors.push(anchor);
            return anchor;
        }

        function generateLevel() {
            for (var i = 0; i < 100; i+=1) {
                createAnchor(-200-i*100);
            };
        }

        function isPlayerOutsideOfScreen() {
            return (player.x<-100 || player.x>500 || player.y <scrolling-50 || player.y > scrolling+700)
        }

        function loadImage(url,callback) {
            var img = new Image();
            img.src = url;
            img.addEventListener("load",function() {
                callback && callback();
            });
            return img;

        }

        eventBus.on("new frame", function (dt) {
            updatePlayer(dt);
            updateScrolling();
            if (isPlayerOutsideOfScreen()) {
                resetLevel();
            }
            draw();

        });

        eventBus.on("mouse left start clicking",function(mouse) {
            player.linkTo = null;
            var realMouse = {
                    x: mouse.canvasX,
                    y: mouse.canvasY+scrolling
                }
            for (var i = 0; i < anchors.length; i++) {

                if (collisions.CollisionCircleAndPoint(realMouse,anchors[i])) {
                    var dis = {
                        x:anchors[i].x-player.x,
                        y:anchors[i].y-player.y
                    }
                    var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
                    if (length<200) {
                        player.linkTo = anchors[i];
                    }
                    return
                }
            };
        });

        resetLevel();
    };

});
