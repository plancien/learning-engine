
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, Canvas, frames, Mouse) {
    var game = {};

    window.gravityEngine = gravityEngine;
    window.pGame = game;
    window.collisionEngine = collisionEngine;
    window.heroEngine = heroEngine;

    game.frame = 0;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;

    heroEngine.collisionInit("canvas", game.canvas, true);                  //Ajoute une box (ici le canvas) à tous les hero, le true permet de dire que les hero vont collisioner entre eux

    collisionEngine.addGroup("wall", ["hero"], false, false);       //créer un group mur, qui collisione avec le groupe hero, ne collisionne pas entre eux, ne sont pas a l'interieur d'une box 
    collisionEngine.addGroup("bleu", false, false, ['specialBox']);         //On créer un groupe bleu - collisione avec aucun groupe - ne collisionne pas avec avec son groupe - on met la box dedans


    var specialBox = {"x" : 200, "y" : 200, "width" : 200, "height" : 200, "color" : "rgba(255,0,0,0.5)"}; //On créer un box speciale
    collisionEngine.addBox("specialBox", specialBox);                                                       //On ajoute la box dans le moteur de collision
    

    var superHero = heroEngine.create({x:100}, game.canvas.context, true);   //On créer un hero standard, on lui dit true pour dire qu'il est sous gravite
    eventBus.on("key pressed up", function(){ superHero.speedY = -10 });    //On lui rajoute une fonction de saut a la vole     


    var creerHeroPersonnalise = function(){
        var inputs = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
        var config = { "x" : 20, "y" : 100, "maxSpeed" : 30, "acceleration" : 1, "deceleration" : 10, "color" : "rgba(0,0,255,0.7)", "width" : 30, "height" : 20, "inputs" : inputs};
        game.littleHero = heroEngine.create(config, game.canvas.context);   //On créer et memorise ce hero
        collisionEngine.addHitbox(game.littleHero, "rect", -10, -10, 50, 40)        //On lui rajoute une hitbox arbitraire plus grande            
        game.littleHero.collisionCallback['specialBox'] = function (side, box){ //On lui créer son callback sur la collision avec ce groupe
            if (side == "in"){
                console.log("Vous etes sortie par : " + side);
                game.littleHero.x = 600;
                game.littleHero.y = 300;
            }
        }
        collisionEngine.addElement(game.littleHero, "bleu");            //On y met notre petit hero - il vas collisionner avec special box
    }();


    var creerDangerPersonnalise = function(){
        var inputs = {"left":"left", "right":"right", "up":"up", "down":"down"};   //On applique des inputs pour ce hero
        var config = { "x" : 120, "y" : 100, "maxSpeed" : 30, "acceleration" : 1, "deceleration" : 10, "color" : "rgba(0,0,255,0.7)", "width" : 30, "height" : 20, "inputs" : inputs};
        game.dangerHero = heroEngine.create(config, game.canvas.context);   //On créer et memorise ce hero
        collisionEngine.addHitbox(game.dangerHero, "rect", -10, -10, 50, 40)        //On lui rajoute une hitbox arbitraire plus grande            
        game.dangerHero.collisionCallback['specialBox'] = function (side, box){ //On lui créer son callback sur la collision avec ce groupe
            if (side == "in"){
                console.log("Vous etes sortie par : " + side);
                game.dangerHero.x = 600;
                game.dangerHero.y = 300;
            }
        }
        collisionEngine.addElement(game.dangerHero, "rouge");            //On y met notre petit hero - il vas collisionner avec special box
    }();


    var creerMur = function(){
        wall.create(100, 400, 600, 30);     
        collisionEngine.addElement(wall.content[0], "wall");            //On met juste un mur dedans pour les test
        wall.content[0].collisionCallback["hero"] = function(opponent){ //On lui attribut une fonction de callback quand collisionne avec un hero
            if (opponent.y + opponent.height > wall.content[0].y + wall.content[0].height)      //(on simule un mur juste en y)
                opponent.y = wall.content[0].y + wall.content[0].height;
            else
                opponent.y = wall.content[0].y - opponent.height;
            opponent.speedY = -2;                                                               //On fais sautiller ce qui touche le mur
        }
    }();

    
 

    game.canvas.context.font = "20pt Calibri,Geneva,Arial";
    game.canvas.context.strokeStyle = "rgb(255,255,0)";
    game.canvas.context.fillStyle = "rgb(0,0,180)";



    var run = function(game){
	    requestAnimationFrame(function(){run(game)});
        game.frame++;
        game.canvas.context.fillStyle = "rgba(220,0,220,0.8)";
	    game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.canvas.context.fillStyle = specialBox.color;
        game.canvas.context.fillRect(specialBox.x, specialBox.y, specialBox.width, specialBox.height);
        game.canvas.context.strokeText("Exemple utilisation modules : fleche et qsdz pour deplacer personnages", 0, 30);
        game.canvas.context.strokeText("N'hesiter pas à faire des test dans Simba.js - modifier les fonctions de comportement - parametre des modules", 0, 60);
        game.canvas.context.strokeText("modifier les fonctions de comportement - parametre des modules", 0, 90);

        collisionEngine.calcul();
        gravityEngine.calcul();
        heroEngine.render();
        wall.render(game.canvas.context);

        if (game.frame < 120)
            collisionEngine.render(game.canvas.context);                     //Permet d'afficher les hitboxs
    };
    requestAnimationFrame(function(){run(game)});
});