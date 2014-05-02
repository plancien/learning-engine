
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


    var specialBox = {"x" : 100, "y" : 600, "width" : 600, "height" : 50, "color" : "rgba(255,0,0,0.5)"}; //On créer un box speciale
    collisionEngine.addBox("specialBox", specialBox);                                                       //On ajoute la box dans le moteur de collision
    

    //var superHero = heroEngine.create({x:100}, game.canvas.context, true);   //On créer un hero standard, on lui dit true pour dire qu'il est sous gravite
    //eventBus.on("key pressed up", function(){ superHero.speedY = -10 });    //On lui rajoute une fonction de saut a la vole     


    var creerCubeTombant = function(){
        var posX = 100 + Math.floor(Math.random() * 5) * 125;
        console.log(posX);
        var config = { "x" : posX, "y" : 10, "maxSpeed" : 30, "acceleration" : 1, "deceleration" : 10, "color" : "rgba(0,0,255,0.7)", "width" : 100, "height" : 70};
        game.cubeTombant = heroEngine.create(config, game.canvas.context);   //On créer et memorise ce cube
        collisionEngine.addHitbox(game.cubeTombant, "rect", -10, -10, 110, 80)        //On lui rajoute une hitbox arbitraire plus grande            
        game.cubeTombant.collisionCallback['specialBox'] = function (side, box){ //On lui créer son callback sur la collision avec ce groupe
        if (side != "in"){
                game.cubeTombant.x = posX;
                game.cubeTombant.y += 3;
            }
        }
        collisionEngine.addElement(game.cubeTombant, "bleu");
    };



    var creerMur = function(){
        wall.create(100, 550, 600, 30);     
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

         for(i = 0; i < 5; i++){
            creerCubeTombant();
        }
        
        collisionEngine.calcul();
        gravityEngine.calcul();
        heroEngine.render();
        wall.render(game.canvas.context);

        if (game.frame < 120)
            collisionEngine.render(game.canvas.context);                     //Permet d'afficher les hitboxs
    };
    requestAnimationFrame(function(){run(game)});
});