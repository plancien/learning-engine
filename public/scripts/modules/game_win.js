define([
    'event_bus',
    'modules/add_domElem',
    'modules/canvas'
], function(eventBus) {
    
    eventBus.on("win", function() {
        function replay() {
            location.reload();
        }
        var taille = WindowSize.getWindowSize();
        var csswin = "width:" + window.innerWidth + "px;height:" + window.innerHeight + "px;position:absolute;cursor:pointer;z-index:15;background:#00CCFF url('../images/win.png') no-repeat center;";
        eventBus.emit("createElement", {
            elem: "div",
            stylesheet: csswin,
            id: "win",
            typeEvent: "click",
            event: replay
        });

    });
});
