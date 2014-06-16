define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/mouse'
    ],function (eventBus, canvas, frames, mouse)
    {
         var canvas = canvas.create({"width":700,"height":700});
         var context = canvas.context;

         var imageFlag = new Image();
		 imageFlag.src = '../../images/sprites/flags.png';

         var posX = 0;
         var posY = 0;

		eventBus.on('new frame',function()
		{
		    context.fillStyle="#000000";
		    context.fillRect(0,0,800,800); 

		    context.drawImage(imageFlag, posX-50, posY-50,100,100, posX-50, posY-50, 100,100);
			//context.clearRect(posX-50,posY-50,100,100);
		})

		eventBus.on('mouse update',function (mouse){
		    posX = mouse.canvasX;
		    posY = mouse.canvasY;
		})

})
