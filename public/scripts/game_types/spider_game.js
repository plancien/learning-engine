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
        var canvas = canvasFactory.create({"width" : 400, "height" : 600});
        var ctx = canvas.context; console.log(canvas);
        var gravity = 0.001;
        var anchors = [];
        createAnchor();
        createAnchor();
        createAnchor();

        ctx.fillRect(0,0,400,600);

        var player = {
            x:100,
            y:0,
            vx:0,
            vy:0,
            linkTo: createAnchor(),
            dir: 1
        };

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
                player.vx *= 0.99
                player.vy *= 0.99
            } else {
                player.vy += gravity;
                
            }
        }

        function draw() {
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,400,600);
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(player.x,player.y,20,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle = "blue";
            for (var i = 0; i < anchors.length; i++) {
                ctx.beginPath();
                ctx.arc(anchors[i].x,anchors[i].y,anchors[i].radius,0,Math.PI*2);
                ctx.fill();
            };
        }

        function createAnchor() {
            var anchor = {
                x:Math.random()*400,
                y:Math.random()*600,
                radius: 20,
            };
            anchors.push(anchor);
            return anchor;
        }

        eventBus.on("new frame", function (dt) {
            updatePlayer(dt);
            draw();
        });

        eventBus.on("mouse left start clicking",function(mouse) {
            player.linkTo = null;
            var realMouse = {
                    x: mouse.canvasX,
                    y: mouse.canvasY
                }
                console.log(realMouse);
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

    };

});
