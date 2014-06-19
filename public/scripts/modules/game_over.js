define([
    'event_bus',
    'modules/add_domElem',
    'modules/canvas'
], function(eventBus, Canvas) {
    
    eventBus.on("gameover", function() {        
        function replay() {
            location.reload();
        }
        var cssgameover = "width:" + window.innerWidth + "px;height:720px;position:absolute;cursor:pointer;z-index:15;background:#000000 url('../images/sprites/gameover.png') no-repeat center;";
        eventBus.emit("createElement", {
            elem: "div",
            stylesheet: cssgameover,
            id: "gameOver",
            typeEvent: "click",
            parent: "containerGameover",
            event: replay
        });
    });
    
});
