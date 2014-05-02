
define([
    'event_bus',
    'modules/cameraRender'
], function(eventBus, cameraRender) { // init,

    var init = function(){
    cameraRender.init(game.canvas, true);

    /***** Son *****/
        game.sounds={
            jump : document.createElement('audio'),
        }
        game.sounds.jump.setAttribute('src', "./sounds/jump.ogg");
        game.sounds.jump.setAttribute('preload','true');

    /***** Configuration d'element generaux *****/
        config.wallColor = "rgba(20,20,20,1)";
        config.backgroundColor = "rgba(30,30,30,1)";

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