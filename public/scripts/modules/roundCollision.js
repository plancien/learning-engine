define(['modules/tools'], function(tools) {

    function addRoundColliderCapabilities (object, collidableObjects)
    {
        object.prototype.detectRoundCollision = function ()
        {
            for (var i = 0; i < collidableObjects.length; i++) 
            {
                if((this.distanceToCollide >= tools.getDistance(this,collidableObjects[i])) && (collidableObjects[i] != this))
                {
                    eventBus.emit('roundCollision', this);
                }
            }
        }
    }

    eventBus.on('init round collision', function (object,collidableObjects) {
        addRoundColliderCapabilities(object,collidableObjects);
    });
});