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
    "modules/text_canvas",
    "modules/dat_gui",
    "modules/resize_img"
], function(eventBus,canvasFactory,frames,mouse,collisions,createTextDisplay,DatGui,resizeImg) {

    var SIZE_IMG = 66;

    return function(params) {
        var config = {
            maxRopeDistance: 300,
            gravity: 0.001,
            scrollingSpeed : 0.1,
            playerScroll : 400,
            stepBetweenAnchors: 100
        }
        var gui = DatGui({});
        gui.add(config,"maxRopeDistance")
        var canvasWidth = 400;
        var canvasHeight = 600
        var canvas = canvasFactory.create({"width" : canvasWidth, "height" : canvasHeight});
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
        var imgcloud = loadImage("/images/sprites/cloud1.png");
        var text = createTextDisplay();
        var cloudX = 0;

        imgplus.addEventListener("load",function() {
            imgplus = resizeImg(imgplus,SIZE_IMG,SIZE_IMG,"fit");
        });
        imgmoin.addEventListener("load",function() {
            imgmoin = resizeImg(imgmoin,SIZE_IMG,SIZE_IMG,"fit");
        });

        function resetLevel() {
            anchors = [];
            scrolling = 0;
            generateLevel();
            anchors[0].ropeRadius = 50;
            player = {
                    x:anchors[0].x,
                    y:anchors[0].y+50,
                    vx:0,
                    vy:0,
                    linkTo: anchors[0],
                    dir: 1
            };
        }

        resetLevel();

        // function updatePlayer (dt) {
        //             player.x += player.vx;
        //             player.y += player.vy;
        //             
        //             
        //             if (player.linkTo) {
        //                 var dis = {
        //                     x:player.linkTo.x-player.x,
        //                     y:player.linkTo.y-player.y
        //                 };
        //                 var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
        //                 var tan = {
        //                     x:-dis.y/length,
        //                     y:dis.x/length
        //                 };
        //                 dis.x = dis.x/length * (length-100);
        //                 dis.y = dis.y/length * (length-100);
        //                 player.vx += dis.x*0.001+tan.x*0.01;
        //                 player.vy += dis.y*0.001+tan.y*0.01;
        //                 player.vx *= 0.99;
        //                 player.vy *= 0.99;
        //             } else {
        //                 player.vy += gravity;
        //                 
        //             }
        //         }
        
        
        function updatePlayer (dt) {
            player.x += player.vx * dt;
            player.y += player.vy * dt;
            
            var fx = 0;
            var fy = gravity;
            
            if (player.linkTo) {
                var ropeVector = {
                    x:player.linkTo.x-player.x,
                    y:player.linkTo.y-player.y
                };
                var length = Math.sqrt(ropeVector.x*ropeVector.x+ropeVector.y*ropeVector.y);
                if (length > player.linkTo.ropeRadius) {
                    var forceRope = (length - player.linkTo.ropeRadius) * 0.00001;
                    var forceRopeVector = {
                        x: ropeVector.x * forceRope / length,
                        y: ropeVector.y * forceRope / length
                    };
                    fx += forceRopeVector.x;
                    fy += forceRopeVector.y;
                }
            }
            
            player.vx += fx * dt;
            player.vy += fy * dt;
        }

        function updateScrolling() {
            if (player.y < scrolling + config.playerScroll) {
                scrolling = player.y-config.playerScroll;
                text.changeText("max : "+Math.floor((-scrolling+config.playerScroll)/50));
            }
            scrolling-=config.scrollingSpeed || 0.1;
            if (anchors[0]>scrolling+660) {
                anchors.shift();
            }
        }

        function draw() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(background, 0, 100*101-600+scrolling,1,600,0,0,400,600);


            cloudX = (cloudX+1)%(649*2)
            ctx.drawImage(imgcloud,-649+cloudX,-20000+scrolling);


            ctx.beginPath();
            ctx.arc(player.x,player.y - scrolling, config.maxRopeDistance, 0, Math.PI*2);
            
            var grd= ctx.createRadialGradient(player.x, player.y - scrolling, config.maxRopeDistance * 0.5, player.x, player.y - scrolling, config.maxRopeDistance);
            grd.addColorStop(0, "rgba(0, 0, 0, 0.0)");
            grd.addColorStop(1, "rgba(0, 0, 0, 0.2)");
            
            ctx.fillStyle = grd;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
            
            ctx.fill();
            ctx.stroke();
            
            
            ctx.fillStyle = "red";
            if (player.linkTo) {
                ctx.beginPath();
                ctx.strokeStyle = "#FF0000";
                ctx.moveTo(player.x, player.y - scrolling);
                ctx.lineTo(player.linkTo.x, player.linkTo.y - scrolling);
                ctx.stroke();
            };
            /*
            ctx.beginPath();
            ctx.arc(player.x,player.y - scrolling ,20,0,Math.PI*2);
            ctx.fill();
>>>>>>> 52bb9bd85ec996d7e2e461ead55195e1020eefc8
            */
            if (player.vx>0) {
                ctx.drawImage(imgCube,0,0,66,66,player.x-33,player.y-33-scrolling,66,66);
            } else {
                ctx.drawImage(imgCube,0,66,66,66,player.x-33,player.y-33-scrolling,66,66);
            }
            ctx.fillStyle = "blue";
            
           
            for (var i = 0; i < anchors.length; i++) {
                var file = anchors[i].good ? imgplus : imgmoin
                ctx.drawImage(file,
                              anchors[i].x-anchors[i].radius,
                              anchors[i].y-anchors[i].radius-scrolling
                );
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

        function createAnchor(y,good) {
            var anchor = {

                x:Math.random()*300+50,
                y:y || Math.random()*600,
                radius: SIZE_IMG*0.5,
                good: good//Math.random()>0.5
                //x:Math.random()*canvasWidth,
                //y:y || Math.random()*canvasHeight,
                //radius: 20
            };
            anchors.push(anchor);
            return anchor;
        }

        function generateLevel() {
            for (var i = 0; i < 10000; i+=config.stepBetweenAnchors) {
                createAnchor(-200-i,false);
                createAnchor(-200-i,true);
            };
        }

        function isPlayerOutsideOfScreen() {
            return (player.y > scrolling+700)
            return (player.x<-100 || player.x>500 || player.y <scrolling-50 || player.y > scrolling+800)
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
            var realMouse = {
                    x: mouse.canvasX,
                    y: mouse.canvasY+scrolling
                };
            //player.linkTo = null;
            for (var i = 0; i < anchors.length; i++) {

                if (collisions.CollisionCircleAndPoint(realMouse,anchors[i])) {
                    var dis = {
                        x:anchors[i].x-player.x,
                        y:anchors[i].y-player.y
                    };
                    var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
                    if (length < config.maxRopeDistance+10 && anchors[i].good) {
                        player.linkTo = anchors[i];
                        player.linkTo.ropeRadius = length * 0.4;
                        return;
                    } else {
                        player.linkTo = null;
                    }
                    
                }
            };
        });

        resetLevel();
    };

});
