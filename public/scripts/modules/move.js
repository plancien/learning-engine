define(['event_bus'], function(eventBus) {
    
    function addMoveCapabilities (object,speed)
    {
        object.prototype.speed = speed;
        object.prototype.idle = true;

        object.prototype.moveUp = function ()
        {
            this.y          -=      this.speed;
            this.idle      =       false;
        }
        object.prototype.moveDown = function ()
        {
            this.y          +=      this.speed;
            this.iddle      =       false;
        }
        object.prototype.moveLeft = function ()
        {
            this.x          -=      this.speed;
            this.idle      =       false;
        }
        object.prototype.moveRight = function ()
        {
            this.x          +=      this.speed;
            this.idle      =       false;

        }
        // can be use to stop the render animation if the object don't move
        object.prototype.stopMoving =function ()
        {
            this.idle      =       true;
        }
    }

    eventBus.on('init', function (object,speed) {
        addMoveCapabilities(object,speed);
        eventBus.emit('move methods', object);
    });   
});