define(['event_bus'], function(eventBus) {

    eventBus.on('replaceAtRandomPos', function(object, canvas) 
    {
        if(object.x != undefined && object.y != undefined){
            if(object.x != null && object.y != null){
                object.x = 0;
                object.y = 0;

                newPosX = Math.random()*canvas.width;
                newPosY = Math.random()*canvas.height;

                object.x = newPosX;
                object.y = newPosY;
            }
        }
    }           
});