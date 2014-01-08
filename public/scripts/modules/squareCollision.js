define(['event_bus'], function (eventBus) {

    /***********************************************************************
      You Must Use PlugIn addColliderCapabilities in order to make it Works
      - Add all your objects collidable first
      - Then use this lib
    ***********************************************************************/
    
    function addSquareColliderCapabilities (object, collidableObjects)
    {
        object.prototype.detectSquareCollision = function ()
        {
            for (var i = 0; i < collidableObjects.length; i++) 
            {
                if (collidableObjects[i] != this) 
                {
                    var colliderOfObject = collidableObjects[i].sides;
                    if ((this.y + this.height >= colliderOfObject[2].y) && (this.y <= colliderOfObject[2].y + colliderOfObject[2].height) && (this.x + this.width >= colliderOfObject[2].x) &&(this.x <= colliderOfObject[2].x + colliderOfObject[2].width))
                    {
                        eventBus.emit('collision', this, "right");
                    }
                    if ((this.y + this.height >= colliderOfObject[0].y) && (this.y <= colliderOfObject[0].y + colliderOfObject[0].height) && (this.x + this.width >= colliderOfObject[0].x) &&(this.x <= colliderOfObject[0].x + colliderOfObject[0].width))
                    {
                        eventBus.emit('collision', this, "left");
                    }
                    if ((this.y + this.height >= colliderOfObject[1].y) && (this.y <= colliderOfObject[1].y + colliderOfObject[1].height) && (this.x + this.width >= colliderOfObject[1].x) &&(this.x <= colliderOfObject[1].x + colliderOfObject[1].width))
                    {
                        eventBus.emit('collision', this, "top");
                    }
                    if ((this.y + this.height >= colliderOfObject[3].y) && (this.y <= colliderOfObject[3].y + colliderOfObject[3].height) && (this.x + this.width >= colliderOfObject[3].x) &&(this.x <= colliderOfObject[3].x + colliderOfObject[3].width))
                    {
                        eventBus.emit('collision', this, "bottom");
                    }
                }
            }
        }
    }

    eventBus.on('init square collision', function (object,collidableObjects) {
        addSquareColliderCapabilities(object,collidableObjects);
    });
});