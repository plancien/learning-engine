define(['event_bus'], function(eventBus) {

    function addPhysicalProperties(object, params) {
        object.maxFallSpeed = params.maxFallSpeed || 5;

        object.currentFallSpeed = params.initFallSpeed || 0;

        //The value that will be added to the fall speed at each frame
        object.step = params.step || 0.5;

        object.acceleration = function() {
            if (object.currentFallSpeed < object.maxFallSpeed) object.currentFallSpeed += object.step;
        };

        object.applyGravity = function() {
            object.y += object.currentFallSpeed;
        };
    }

    eventBus.on('set gravity on', function(object) {
        eventBus.on('new frame', function() {
            object.acceleration();
            object.applyGravity();
        });
    });

    return addPhysicalProperties;

});
