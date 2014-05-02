define(['event_bus'], function(eventBus) {

    eventBus.on('collisionCercle', function(object1,object2,radiusObject1,radiusObject2) 
    {
        if((object1.x-object2.x)*(object1.x-object2.x)+(object1.y-object2.y)*(object1.y-object2.y) <= radiusObject1*radiusObject1+radiusObject2*radiusObject2)
            return true;
        else
            return false;
    }           
});