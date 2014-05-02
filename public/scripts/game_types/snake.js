define([
    'event_bus',
    'modules/canvas',
], function(eventBus, Canvas) {
	var game = {};
	var canvas = Canvas.create({"width" : 800, "height" : 600});
	game.canvas = canvas.canvas;
	game.context = canvas.context
	console.log(game.canvas)
	game.context.fillStyle = "rgb(0,0,0)";
	game.context.fillRect(0,0, 800, 600); 
	alert("hello world");
	// grille(game)
});
function grille(game){
	var carre = {}
    carre.height = 20;
    carre.width  = 20;
    var maxX = (canvas.width/carre.height + carre.width);
    var maxY = (canvas.height/carre.height + carre.width);
    game.context.fillStyle = 'white';
     for(var iX = 0; iX < maxX; iX++){
        for(var iY = 0; iY < maxY; iY++){
            //Dessiner ---------
            game.context.drawLine(0, (iY * carre.height + carre.width), canvas.width, (iY * carre.height + carre.width));
            //Dessiner | | | | |
            game.context.drawLine((iX * carre.height + carre.width), 0, (iX * carre.height + carre.width), canvas.height);
        }
    }
}
