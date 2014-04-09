
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames'
], function(eventBus, heroEngine, collisionEngine, Canvas, frames, Mouse) {
    var game = {};
    window.pGame = game;
    window.collisionEngine = collisionEngine;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;

    heroEngine.collisionInit("canvas", game.canvas, true); //Ajoute une box (ici le canvas) à tous les hero, le true permet de dire que les hero vont collisioner entre eux
    heroEngine.create(config, game.canvas.context); //On créer un hero standard

    var inputs = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
    var config = { "x" : 20, "y" : 100, "maxSpeed" : 30, "acceleration" : 1, "deceleration" : 10, "color" : "rgba(0,0,255,0.7)", "width" : 30, "height" : 20, "inputs" : inputs};
    game.littleHero = heroEngine.create(config, game.canvas.context);   //On créer et memorise ce hero

    var specialBox = {"x" : 200, "y" : 200, "width" : 200, "height" : 200, "color" : "rgba(255,0,0,0.5)"}; //On créer un box speciale
    collisionEngine.addBox("specialBox", specialBox);                       //On ajoute la box dans le moteur de collision
    collisionEngine.addGroup("bleu", "all", false, ['specialBox']);         //On créer un groupe qui vas interagir avec special box
    collisionEngine.addElement(game.littleHero, "bleu");                    //On y met notre petit hero                

    game.littleHero.collisionCallback['specialBox'] = function (side, box){ //On lui créer son callback sur la collision avec ce groupe
        if (side != "in"){
            console.log("Vous etes sortie par : " + side);
            game.littleHero.x = 300;
            game.littleHero.y = 300;
        }
    }
    var run = function(game){
	    requestAnimationFrame(function(){run(game)});
        game.canvas.context.fillStyle = "rgba(220,0,220,0.8";
	    game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.canvas.context.fillStyle = specialBox.color;
        game.canvas.context.fillRect(specialBox.x, specialBox.y, specialBox.width, specialBox.height);
        collisionEngine.calcul();
        heroEngine.render();
        // collisionEngine.render(game.canvas.context);                     //Permet d'afficher les hitboxs
    };
    requestAnimationFrame(function(){run(game)});
});
