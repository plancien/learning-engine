define(['event_bus'], function(eventBus) {

    function addMoveCapabilities(object, speed) {
        object.speed = speed;
        object.idle = true;

        object.moveUp = function() {
            this.y -= this.speed;
            this.idle = false;
        };
        object.moveDown = function() {
            this.y += this.speed;
            this.iddle = false;
        };
        object.moveLeft = function() {
            this.x -= this.speed;
            this.idle = false;
        };
        object.moveRight = function() {
            this.x += this.speed;
            this.idle = false;
        };

        // can be use to stop the render animation if the object don't move
        object.stopMoving = function() {
            this.idle = true;
        };
    }

    eventBus.on('add move', function(object, speed) {
        addMoveCapabilities(object, speed);
        eventBus.emit('move methods', object);
    });

});
