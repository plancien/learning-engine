define(["game_types/spider_game/config"], function(config){
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

    function draw(ctx, scrolling,imgs,player,anchors) {
        drawSky(ctx, scrolling,imgs,player);
        drawCloud(ctx, scrolling,imgs,player);
        drawMaxDistance(ctx, scrolling,imgs,player);
        drawRope(ctx, scrolling,imgs,player);
        drawPlayer(ctx, scrolling,imgs,player);
        drawAnchor(ctx, scrolling,imgs,player,anchors);
    }

    function drawSky(ctx,scrolling,imgs,player) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
        ctx.drawImage(background, 0, 100*101-600+scrolling,1,600,0,0,config.canvasWidth,config.canvasHeight);
    }

    function drawCloud(ctx,scrolling,imgs,player) {
        cloudX = (cloudX+1)%(649*2)
        ctx.drawImage(imgs.cloud,-649+cloudX,-20000+scrolling);
    }

    function drawMaxDistance(ctx,scrolling,imgs,player) {
        var grd= ctx.createRadialGradient(player.x, player.y - scrolling, config.maxRopeDistance * 0.5, player.x, player.y - scrolling, config.maxRopeDistance);
        grd.addColorStop(0, "rgba(0, 0, 0, 0.0)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0.2)");
        
        ctx.fillStyle = grd;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.beginPath();
        ctx.arc(player.x,player.y - scrolling, config.maxRopeDistance, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
    }

    function drawRope(ctx,scrolling,imgs,player) {
        ctx.fillStyle = "red";
        if (player.linkTo) {
            ctx.beginPath();
            ctx.strokeStyle = config.draw.ropeStroke;
            ctx.lineWidth = config.draw.ropeWidth;
            ctx.moveTo(player.x, player.y - scrolling);
            ctx.lineTo(player.linkTo.x, player.linkTo.y - scrolling);
            ctx.stroke();
        };
    }

    function drawPlayer(ctx,scrolling,imgs,player) {
        if (player.vx>0) {
            ctx.drawImage(imgs.cube,
                          0,0,66,66,
                          player.x - 33, player.y - 33 - scrolling, 66, 66
                          );
        } else {
            ctx.drawImage(imgs.cube,
                          0,66,66,66,
                          player.x - 33, player.y - 33 - scrolling, 66, 66
                          );
        }
    }

    function drawAnchor(ctx,scrolling,imgs,player,anchors) {
        ctx.strokeStyle = config.draw.anchorsStroke;
        ctx.lineWidth = config.draw.anchorsWidth;
        for (var i = 0; i < anchors.length; i++) {
            ctx.drawImage(anchors[i].img,
                              anchors[i].x-anchors[i].radius,
                              anchors[i].y-anchors[i].radius-scrolling
            );
        };
    }

    function drawScore(ctx,scrolling,imgs,player) {
        ctx.fillStyle = "blue";
        ctx.drawImage(text,5,5);
    }

    return draw;
});