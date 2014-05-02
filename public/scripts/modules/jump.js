define(['event_bus'],function(eventBus)
{
	eventBus.on('jump',function(object1,object2,vitY,gravity)
	{
		vitY -= gravity;
		object1.y += vitY;
		if(vitY >= 0)
		{
			if(object1.y < object2.y + object2.height)
			{
				vitY = -vitY;
				eventBus.emit('jump',object1,object2,vitY,gravity);
			}
		}
		else
		{
			if(object1.y + object1.height < object2.height)
			{
				eventBus.emit('jump',object1,object2,vitY,gravity);
			}
		}
	})
})