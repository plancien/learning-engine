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
    "modules/resize_img",
    "modules/img_loader",
    "modules/load_bonus"
], function(eventBus,canvasFactory,frames,mouse,collisions,createTextDisplay,DatGui,resizeImg,imgLoad,loadBonus) {

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
        var text = createTextDisplay();
        var cloudX = 0;


        
        var imgCube = imgLoad.add("/images/sprites/cube.png","cube");
        var imgcloud = imgLoad.add("/images/sprites/cloud1.png","cloud");
        var bonusImgName = loadBonus(params.bonus);
        var malusImgName = loadBonus(params.malus);


        var imgs = imgLoad({},function() {
            for (var i = bonusImgName.length - 1; i >= 0; i--) {
                imgs[bonusImgName[i]] = resizeImg(imgs[bonusImgName[i]],SIZE_IMG,SIZE_IMG,"fit");
            };

            for (var i = malusImgName.length - 1; i >= 0; i--) {
                imgs[malusImgName[i]] = resizeImg(imgs[malusImgName[i]],SIZE_IMG,SIZE_IMG,"fit");
            };

            imgCube = imgs.cube;
            imgcloud = imgs.cloud;

            resetLevel();

            eventBus.on("new frame", function (dt) {
                updatePlayer(dt);
                updateScrolling();
                if (isPlayerOutsideOfScreen()) {
                    resetLevel();
                }
                draw();

            });
        })

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
            if (player.vx>0) {
                ctx.drawImage(imgCube,0,0,66,66,player.x-33,player.y-33-scrolling,66,66);
            } else {
                ctx.drawImage(imgCube,0,66,66,66,player.x-33,player.y-33-scrolling,66,66);
            }
            ctx.fillStyle = "blue";
            
           
            for (var i = 0; i < anchors.length; i++) {
                ctx.drawImage(anchors[i].img,
                              anchors[i].x-anchors[i].radius,
                              anchors[i].y-anchors[i].radius-scrolling
                );
            };
            ctx.drawImage(text,5,5);
            
        }

        function createAnchor(y,good) {
            var table = good ? bonusImgName : malusImgName;
            var anchor = {
                x:Math.random()*300+50,
                y:y || Math.random()*600,
                radius: SIZE_IMG*0.5,
                good: good,
                img: imgs[table[(table.length*Math.random())|0]]
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
