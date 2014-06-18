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
    "modules/resize_img",
    "modules/img_loader",
    "modules/load_bonus",
    "game_types/spider_game/draw",
    "game_types/spider_game/player",
    "modules/score"

], function(
            eventBus,
            canvasFactory,
            frames,
            mouse,
            collisions,
            resizeImg,
            imgLoad,
            loadBonus,
            draw,
            Player,
            score
    ) {

    var SIZE_IMG = 66;

    return function(params) {
        var config = {
            maxRopeDistance: 300,
            gravity: 0.001,
            scrollingSpeed : 0.1,
            playerScroll : 400,
            stepBetweenAnchors: 100
        }
        var canvasWidth = 400;
        var canvasHeight = 600
        var canvas = canvasFactory.create({"width" : canvasWidth, "height" : canvasHeight});
        var player = new Player();
        var anchors, scrolling;

        var bonusImgName = loadBonus(params.bonus);
        var malusImgName = loadBonus(params.malus);


        var imgs = imgLoad({cube:"/images/sprites/cube.png",cloud:"/images/sprites/cloud1.png"},function() {
            for (var i = bonusImgName.length - 1; i >= 0; i--) {
                imgs[bonusImgName[i]] = resizeImg(imgs[bonusImgName[i]],SIZE_IMG,SIZE_IMG,"fit");
            };

            for (var i = malusImgName.length - 1; i >= 0; i--) {
                imgs[malusImgName[i]] = resizeImg(imgs[malusImgName[i]],SIZE_IMG,SIZE_IMG,"fit");
            };

            resetLevel();

            eventBus.on("new frame", function (dt) {
                player.update(dt,config.gravity);
                updateScrolling();
                if (player.isOutsideOfScreen(scrolling)) {
                    resetLevel();
                }
                draw(canvas.context,{
                    canvasWidth: canvasWidth,
                    canvasHeight: canvasHeight,
                    scrolling: scrolling,
                    config: config
                },imgs,player,anchors)
            });
        })

        function resetLevel() {
            anchors = [];
            scrolling = 0;
            generateLevel();
            anchors[1].ropeRadius = 50;
            player.reset(anchors[0].x,anchors[0].y+50);
            player.linkTo = anchors[1];
        }

        function updateScrolling() {
            if (player.y < scrolling + config.playerScroll) {
                scrolling = player.y-config.playerScroll;
                eventBus.emit("set score", Math.floor((-scrolling+config.playerScroll)/50));
            }
            scrolling-=config.scrollingSpeed || 0.1;
            if (anchors[0]>scrolling+660) {
                anchors.shift();
            }
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
                createAnchor(-200-i+Math.random()*50,false);
                createAnchor(-200-i+Math.random()*50,true);
            };
        }

        

        eventBus.on("mouse left start clicking",function(mouse) {
            var realMouse = {
                    x: mouse.canvasX,
                    y: mouse.canvasY+scrolling
                };
            for (var i = 0; i < anchors.length; i++) {
                if (collisions.circlePoint(realMouse,anchors[i])) {

                    player.tryToLink(anchors[i],config);
                }
            };
        });

        resetLevel();
    };

});
