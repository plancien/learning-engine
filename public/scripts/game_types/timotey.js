define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
], function (eventBus,canvasCreate,framer,Game) {	//Déclare les variables contenant les modules chargé dans define([])

	//Le module retourné
    return function(params) {
        var container;
        //équivalent du window.onload
        eventBus.on('init', function (_container) {
        	//???
             container = _container;
             //Ici je récupère le canvas, canvasCreate est le module canvas.js chargé plus haut
             var canvas = canvasCreate.create({width:800,height:600,});
             var context = canvas.context;
             //Je créé un carré que l'on affichera
             var box = {
             	x:0,
             	y:0,
             	w:100,
             	h:100,
             	color: 'red'
             };

             context.fillStyle = "black";
             context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
             //On ajoute un écouteur sur 'new frame', évènement défini dans frames.js
             //Le callback correspond à notre mainLoop / Update 
             eventBus.on('new frame', function(){
             	context.fillStyle = "black";
             	context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
             	
             	box.x++;

             	context.fillStyle = box.color;
             	context.fillRect(box.x,box.y,box.w,box.h);
             });
        });
    }
});