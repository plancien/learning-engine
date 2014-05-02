define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/mouse',
    'modules/image_loader'
    ],function (eventBus, canvas, frames, mouse, imageLoader)
    {
         var canvas = canvas.create({"width":800,"height":800});
         var context = canvas.context;

         var posX = 0;
         var posY = 0;

		eventBus.on('new frame',function()
		{
		    context.fillStyle="#000000";
		    context.fillRect(0,0,800,800); 

			context.clearRect(posX-50,posY-50,100,100);
		})

		eventBus.on('mouse update',function (mouse){
		    posX = mouse.canvasX;
		    posY = mouse.canvasY;
		})

})
