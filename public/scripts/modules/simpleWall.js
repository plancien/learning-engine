 define(['event_bus'], function(eventBus) {

    var WallEngine = function(){
    }
    WallEngine.prototype.content = [];
    WallEngine.prototype.create = function(x,y,width,height, color){
        var wall = {};
        wall.x = x || 0;
        wall.y = y || 0;
        wall.width = width || 100;
        wall.height = height || 50;
        wall.color = color || "black";
        this.content.push(wall);
        eventBus.emit("wall create", wall);
    }
    WallEngine.prototype.render = function(context){
        for (var i = this.content.length - 1; i >= 0; i--) {
            context.fillStyle = this.content[i].color;
            context.fillRect(this.content[i].x, this.content[i].y, this.content[i].width, this.content[i].height);
        };
    }
    return new WallEngine();
});