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
    "game_types/spider_game/level",
    "game_types/spider_game/config",
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
            Level,
            config,
            score
    ) {


    return function(params) {
        var canvas = canvasFactory.create({"width" : config.canvasWidth, "height" : config.canvasHeight});
        var bonusImgName = loadBonus(params.bonus);
        var malusImgName = loadBonus(params.malus);

        var level = new Level(bonusImgName,malusImgName);
        var player = new Player();
        var scrolling = 0;

        var imgs = imgLoad({cube:"/images/sprites/cube.png",cloud:"/images/sprites/cloud1.png"},function() {
            for (var i = bonusImgName.length - 1; i >= 0; i--) {
                imgs[bonusImgName[i]] = resizeImg(imgs[bonusImgName[i]],config.size_img,config.size_img,"fit");
            };

            for (var i = malusImgName.length - 1; i >= 0; i--) {
                imgs[malusImgName[i]] = resizeImg(imgs[malusImgName[i]],config.size_img,config.size_img,"fit");
            };

            eventBus.on("new frame", function (dt) {
                player.update(dt,config.gravity);
                updateScrolling();
                if (player.isOutsideOfScreen(scrolling)) {
                    resetLevel();
                }
                draw(canvas.context,scrolling,imgs,player,level.anchors)
            });

            resetLevel();
        })

        function resetLevel() {
            scrolling = 0;
            level.generate(imgs);
            player.reset(level.anchors[0].x,level.anchors[0].y+50);
            player.linkTo = level.anchors[1];
            level.anchors[1].ropeRadius = 50;
        }

        function updateScrolling() {
            if (player.y < scrolling + config.playerScroll) {
                scrolling = player.y-config.playerScroll;
                eventBus.emit("set score", Math.floor((-scrolling+config.playerScroll)/50));
            }
            scrolling-=config.scrollingSpeed || 0.1;
            if (level.anchors[0]>scrolling+660) {
                level.anchors.shift();
            }
        }

        eventBus.on("mouse left start clicking",function(mouse) {
            var realMouse = {
                    x: mouse.canvasX,
                    y: mouse.canvasY+scrolling
                };
            for (var i = 0; i < level.anchors.length; i++) {
                if (collisions.circlePoint(realMouse,level.anchors[i])) {
                    player.tryToLink(level.anchors[i],config);
                }
            };
        });
    };

});
