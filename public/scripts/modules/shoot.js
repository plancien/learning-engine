define(['event_bus','modules/frames'], function(eventBus, frames){

    eventBus.on('missile', function (X,Y,direction, speed,canvas) {
        
        var lifetime = 0;

        eventBus.on("new frame", function(){
        
        canvas.context.clearRect(0,0,1200,1200);
        lifetime ++;
        if (direction == 1)
        {
            X-=speed;
        }
        else if (direction == 2)
        {
            X+=speed;
        }
        else if (direction == 3)
        {
            Y-=speed;
        }
        else if (direction == 4)
        {
            Y+=speed;
        }
        canvas.context.fillStyle = "rgb(0,253,0)";
        canvas.context.fillRect(X,Y, 5, 5);

        });

    });
});