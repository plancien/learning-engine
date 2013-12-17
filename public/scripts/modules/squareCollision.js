define(['event_bus'], function (eventBus) {

    /***********************************************************************
      You Must Use PlugIn addColliderCapabilities in order to make it Works
      - Add all your objects collidable first
      - Then use this lib
    ***********************************************************************/
    
    function addSquareColliderCapabilities (object, collidableObjects)
    {
        object.prototype.detectCollision = function ()
        {
            for (var i = 0; i < collidableObjects.length; i++) 
            {
                if (collidableObjects[i] != object) 
                {
                    var colliderOfObject = collidableObjects[i].sides;
                    if ((object.y + object.height >= colliderOfObject[2].y) && (object.y <= colliderOfObject[2].y + colliderOfObject[2].height) && (object.x + object.width >= colliderOfObject[2].x) &&(object.x <= colliderOfObject[2].x + colliderOfObject[2].width))
                    {
                        object.x += object.speed;
                    }
                    if ((object.y + object.height >= colliderOfObject[0].y) && (object.y <= colliderOfObject[0].y + colliderOfObject[0].height) && (object.x + object.width >= colliderOfObject[0].x) &&(object.x <= colliderOfObject[0].x + colliderOfObject[0].width))
                    {
                        object.x -= object.speed;
                    }
                    if ((object.y + object.height >= colliderOfObject[1].y) && (object.y <= colliderOfObject[1].y + colliderOfObject[1].height) && (object.x + object.width >= colliderOfObject[1].x) &&(object.x <= colliderOfObject[1].x + colliderOfObject[1].width))
                    {
                        object.y -= object.speed;
                    }
                    if ((object.y + object.height >= colliderOfObject[3].y) && (object.y <= colliderOfObject[3].y + colliderOfObject[3].height) && (object.x + object.width >= colliderOfObject[3].x) &&(object.x <= colliderOfObject[3].x + colliderOfObject[3].width))
                    {
                        object.y += object.speed;
                    }
                }
            }
        }
    }

    eventBus.on('init square collision', function (object,collidableObjects) {
        addSquareColliderCapabilities(object,collidableObjects);
    });
});