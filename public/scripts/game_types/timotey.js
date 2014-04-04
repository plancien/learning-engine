define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/key_listener',
    'event_capabilities'
], function (eventBus,canvasCreate,framer,keyListener,addEventCapabilities) {	//Déclare les variables contenant les modules chargé dans define([])

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
             	speed:10,
             	x:0,
             	y:0,
             	w:100,
             	h:100,
             	color: 'red',
             };

             addEventCapabilities(box);
             
             eventBus.on('key pressed',function(e){
             	a = {
             		x:0,
             		y:0,
             	};
             	if(e=="left"){
             		a.x = -1;
             	}
             	if(e=="up"){
             		a.y = -1;
             	}
             	if(e=="right"){
             		a.x = 1;
             	}
             	if(e=="down"){
             		a.y = 1;
             	}
             	console.log(a,e)
             	box.emit('move', a);
             });

             box.on('move', function(e){
             	box.x += e.x*box.speed;
             	box.y += e.y*box.speed;
             	console.log(e)
             });

             context.fillStyle = "black";
             context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
             //On ajoute un écouteur sur 'new frame', évènement défini dans frames.js
             //Le callback correspond à notre mainLoop / Update 
             eventBus.on('new frame', function(){
             	context.fillStyle = "black";
             	context.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);

             	context.fillStyle = box.color;
             	context.fillRect(box.x,box.y,box.w,box.h);
             });
        });
    }
});