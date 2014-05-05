
define([
    'event_bus',
    'modules/cameraRender',
    'modules/canvas',
    'modules/collisionEngine'
], function(eventBus, cameraRender, Canvas, collisionEngine) { // init,

    var init = function(game){
        game.frame = 0;
        game.canvas = Canvas.create({"width" : 800, "height" : 600});
        game.canvas.width = 800;
        game.canvas.height = 600;
        game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";

        cameraRender.init(game.canvas, true);
        cameraRender.backgroundParralax("./images/pikachuParallax.png", 1, 0.5);


        pikaSpriteConfig = {};
        pikaSpriteConfig.idleLeft = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288};
        pikaSpriteConfig.idleRight = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "scaleX" : -1, "scaleY" : 1};
        pikaSpriteConfig.idleLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "scaleX" : 1, "scaleY" : -1};
        pikaSpriteConfig.idleRightReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 288, "rotation" : Math.PI};
        pikaSpriteConfig.runLeft = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0};
        pikaSpriteConfig.runRight = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : -1, "scaleY" : 1};
        pikaSpriteConfig.runLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "scaleX" : 1, "scaleY" : -1};
        pikaSpriteConfig.runRightReverse = {"width" : 32, "height" :32, "nbAnim" : 8, "loop" : -1, "fps" : 5, "offsetY" : 0, "rotation" : Math.PI};
        pikaSpriteConfig.jumpLeft = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256};
        pikaSpriteConfig.jumpRight = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "scaleX" : -1, "scaleY" : 1};
        pikaSpriteConfig.jumpLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "scaleX" : 1, "scaleY" : -1};
        pikaSpriteConfig.jumpRightReverse = {"width" : 32, "height" :32, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 0, "offsetX" : 256, "rotation" : Math.PI};
        pikaSpriteConfig.waitingLeft = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
        pikaSpriteConfig.waitingRight = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "scaleX" : -1, "scaleY" : 1, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
        pikaSpriteConfig.waitingLeftReverse = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "scaleX" : 1, "scaleY" : -1, "loopCallback" : function (target){target.currentFrameWaiting = 0}};
        pikaSpriteConfig.waitingRightReverse = {"width" : 32, "height" :32, "nbAnim" : 5, "loop" : 1, "fps" : 3, "offsetY" : 0, "offsetX" : 288, "rotation" : Math.PI, "loopCallback" : function (target){target.currentFrameWaiting = 0}};

        cameraRender.addSprite("pikachu", "./images/green_guy_sprites.png", pikaSpriteConfig);

    /***** Son *****/
        game.sounds={
            jump : document.createElement('audio'),
        }
        game.sounds.jump.setAttribute('src', "./sounds/jump.ogg");
        game.sounds.jump.setAttribute('preload','true');

    /***** Initialisation des groupes de collision *****/
        collisionEngine.addGroup("wall", false, false, false);
        collisionEngine.addGroup("bonus", ["pikachu"], false, false);
        collisionEngine.addGroup("pikachu", ["wall"], false, false);

    /***** Gestion des murs *****/
        eventBus.on("wall create", function(target){
            cameraRender.add(target, 10);
            collisionEngine.addElement(target, "wall");
        });

    /***** Gestion des bonus *****/
        eventBus.on("bonus create", function(target){
            target.image = "goodImage";
            cameraRender.add(target, 20);
            collisionEngine.addElement(target, "bonus");
            target.collisionCallback["pikachu"] = function(opponent){
                opponent.speedY = -16;
            }
        });

    /***** On recupere les images du serveur*****/
        eventBus.emit("load images");
        eventBus.on("images loaded", function(images) {
            console.log(images);
            cameraRender.images.goodImage = images["flag_french"];
            cameraRender.images.badImage = images["flag_romanian"];
        });


    }
    return init;
});