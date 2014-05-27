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
    'modules/collisions'
], function(eventBus,canvasFactory,frames,mouse,collisions) {

    return function(params) {
        var maxRopeDistance = 300;
        var canvasWidth = 400;
        var canvasHeight = 600;
        var canvas = canvasFactory.create({"width" : canvasWidth, "height" : canvasHeight});
        var ctx = canvas.context; console.log(canvas);
        var gravity = 0.001;
        var player, anchors, scrolling;

        function resetLevel() {
            anchors = [];
            scrolling = 0;
            generateLevel();
            anchors[0].ropeRadius = 50;
            player = {
                    x: anchors[0].x - 50,
                    y: anchors[0].y - 50,
                    vx:0,
                    vy:0,
                    linkTo: anchors[0],
                    dir: 1
            };
        }

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
            if (player.y < scrolling + canvasWidth) {
                scrolling = player.y-canvasWidth;
            }
            if (anchors[0]>scrolling+660) {
                anchors.shift();
            }
        }

        function draw() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            ctx.beginPath();
            ctx.arc(player.x,player.y - scrolling, maxRopeDistance, 0, Math.PI*2);
            
            var grd= ctx.createRadialGradient(player.x, player.y - scrolling, maxRopeDistance * 0.5, player.x, player.y - scrolling, maxRopeDistance);
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
            
            ctx.beginPath();
            ctx.arc(player.x,player.y - scrolling ,20,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle = "blue";
            for (var i = 0; i < anchors.length; i++) {
                ctx.beginPath();
                ctx.arc(anchors[i].x,anchors[i].y - scrolling,anchors[i].radius,0,Math.PI*2);
                ctx.fill();
            };
            
            ctx.closePath();
            
        }

        function createAnchor(y) {
            var anchor = {
                x:Math.random()*canvasWidth,
                y:y || Math.random()*canvasHeight,
                radius: 20
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
            return false;
            //return (player.x<-50 || (player.x> canvasWidth + 50) || player.y < (scrolling - 50) || player.y > (scrolling + canvasHeight + 100));
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
            for (var i = 0; i < anchors.length; i++) {

                if (collisions.CollisionCircleAndPoint(realMouse,anchors[i])) {
                    var dis = {
                        x:anchors[i].x-player.x,
                        y:anchors[i].y-player.y
                    };
                    var length = Math.sqrt(dis.x*dis.x+dis.y*dis.y);
                    if (length < maxRopeDistance) {
                        player.linkTo = anchors[i];
                        player.linkTo.ropeRadius = length * 0.4;
                    }
                    return;
                }
            };
        });

        resetLevel();
    };

});
