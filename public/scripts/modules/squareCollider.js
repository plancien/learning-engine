define(['event_bus'], function (eventBus) {

    /***********************************************************************
      this lib was created for work with squareCollision lib
      - Add all your objects collidable first with this lib
      - Then use squareCollision lib
    ***********************************************************************/
    
    function addSquareColliderCapabilities (object)
    {
        object.prototype.sides = [{x : this.x, y : this.y, width : 1 , height : this.height},
                                  {x : this.x, y : this.y, width : this.width, height : 1},
                                  {x : this.x + this.width - 1, y : this.y, width : 1, height : this.height},
                                  {x : this.x, y : this.y + this.height - 1, width : this.width, height : 1}];
    }

    eventBus.on('init square collider', function (object, collidableObjects) {
        addSquareColliderCapabilities(object);
        collidableObjects.push(object)
    });
});