define([
    'event_bus',
    "modules/tools"
], function(eventBus,tools) {
 /*
    This function must be used as a prototype

    Object.moveToObject = moveToTarget;

    @param - centered - boolean est ce qu'on doit centrer l'objet ?
 */

    getCanvas = {};
    eventBus.on('newCanvas', function(canvas) {
        getCanvas = canvas;
    }); 
    function moveToTarget (objective,speed,delay,centered) {
        centered = centered || false;
        totalOffsetX = getCanvas.canvas.offsetLeft - getCanvas.canvas.scrollLeft;
        totalOffsetY = getCanvas.canvas.offsetTop - getCanvas.canvas.scrollTop;
        target = centered ? {x:this.x + totalOffsetX + this.width*0.5, y : this.y + totalOffsetY + this.height* 0.5} : {x:this.x + totalOffsetX, y : this.y + totalOffsetY}
        distance = tools.vectors.getDistance(target,objective)
        if (distance < speed){
            this.x = centered ? objective.x - totalOffsetX - this.width*0.5 : objective.x - totalOffsetX;
            this.y = centered ? objective.y - totalOffsetY - this.height*0.5 : objective.y - totalOffsetY;
            return
        }
            speed = delay ? tools.vectors.getDistance(target,objective) / (delay / 1000) : speed;
            this.x -= Math.cos(tools.vectors.getAngle(target,objective))*speed;
            this.y -= Math.sin(tools.vectors.getAngle(target,objective))*speed;
    }
    return moveToTarget;

});


