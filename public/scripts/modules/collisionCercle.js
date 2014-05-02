define(['event_bus'], function(eventBus) {

    eventBus.on('collisionCercle', function(object1,object2,radiusObject1,radiusObject2) 
    {
    if(Math.abs(object1.x-object2.x)+Math.abs(object1.y-object2.y)<= radiusObject1+radiusObject2)
        return true;
    else
        return false;
    }           
});