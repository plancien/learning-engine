define([], function(){
    "use strict";
    var cloudX =0;
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

    function draw(ctx, info,imgs,player,anchors) {
        drawSky(ctx, info,imgs,player);
        drawCloud(ctx, info,imgs,player);
        drawMaxDistance(ctx, info,imgs,player);
        drawRope(ctx, info,imgs,player);
        drawPlayer(ctx, info,imgs,player);
        drawAnchor(ctx, info,imgs,player,anchors);
    }

    function drawSky(ctx,info,imgs,player) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, info.canvasWidth, info.canvasHeight);
        ctx.drawImage(background, 0, 100*101-600+info.scrolling,1,600,0,0,400,600);
    }

    function drawCloud(ctx,info,imgs,player) {
        cloudX = (cloudX+1)%(649*2)
        ctx.drawImage(imgs.cloud,-649+cloudX,-20000+info.scrolling);
    }

    function drawMaxDistance(ctx,info,imgs,player) {
        var grd= ctx.createRadialGradient(player.x, player.y - info.scrolling, info.config.maxRopeDistance * 0.5, player.x, player.y - info.scrolling, info.config.maxRopeDistance);
        grd.addColorStop(0, "rgba(0, 0, 0, 0.0)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0.2)");
        
        ctx.fillStyle = grd;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.beginPath();
        ctx.arc(player.x,player.y - info.scrolling, info.config.maxRopeDistance, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
    }

    function drawRope(ctx,info,imgs,player) {
        ctx.fillStyle = "red";
        if (player.linkTo) {
            ctx.beginPath();
            ctx.strokeStyle = "#FF0000";
            ctx.moveTo(player.x, player.y - info.scrolling);
            ctx.lineTo(player.linkTo.x, player.linkTo.y - info.scrolling);
            ctx.stroke();
        };
    }

    function drawPlayer(ctx,info,imgs,player) {
        if (player.vx>0) {
            ctx.drawImage(imgs.cube,
                          0,0,66,66,
                          player.x - 33, player.y - 33 - info.scrolling, 66, 66
                          );
        } else {
            ctx.drawImage(imgs.cube,
                          0,66,66,66,
                          player.x - 33, player.y - 33 - info.scrolling, 66, 66
                          );
        }
    }

    function drawAnchor(ctx,info,imgs,player,anchors) {
        for (var i = 0; i < anchors.length; i++) {
            ctx.drawImage(anchors[i].img,
                          anchors[i].x-anchors[i].radius,
                          anchors[i].y-anchors[i].radius-info.scrolling
            );
        };
    }

    function drawScore(ctx,info,imgs,player) {
        ctx.fillStyle = "blue";
        ctx.drawImage(text,5,5);
    }

    return draw;
});