define([
    'event_bus',
    'modules/add_domElem',
    'modules/canvas'
], function(eventBus, Canvas) {
    
    eventBus.on("init", function() {
        
        function replay() {
            location.reload();
        }
        var cssgameover = "width: 300px;height:80px;position:absolute;cursor:pointer;z-index:15;background: url('../images/retour.png') no-repeat center;";
        
        eventBus.emit("createElement", {
            elem: "div",
            stylesheet: cssgameover,
            id: "gameOver",
            typeEvent: "click",
            event: replay
        });
    });
    
});