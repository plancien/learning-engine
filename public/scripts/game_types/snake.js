define([
    'event_bus',
    'modules/canvas',
], function(eventBus, canvasModule) {


	alert("hello world");
});
function grille(game){
    var carre.height = 20;
    var carre.width  = 20;
    var maxX = (canvas.width/carre.height + carre.width)
    var maxY = (canvas.height/carre.height + carre.width)
    game.ctx.fillStyle = 'black';
     for(int iX = 0; iX < maxx; iX++){
        for(int iY = 0; iY < maxY; iY++){
            //Dessiner ---------
            game.drawLine(0, (iY * carre.height + carre.width), canvas.width, (iY * carre.height + carre.width));
            //Dessiner | | | | |
            game.drawLine((iX * carre.height + carre.width), 0, (iX * carre.height + carre.width), canvas.height);
        }
    }
}