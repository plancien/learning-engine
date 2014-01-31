define([
    'event_bus',
    'modules/window_size',
    'modules/add_domElem',
    'modules/canvas'
], function(eventBus, WindowSize, Canvas) {
    
    eventBus.on("win", function() {
        function replay() {
            location.reload();
        }
        var taille = WindowSize.getWindowSize();
        var csswin = "width:" + taille.width + "px;height:" + taille.height + "px;position:absolute;cursor:pointer;z-index:15;background:#00CCFF url('../images/win.png') no-repeat center;";
        eventBus.emit("createElement", {
            elem: "div",
            stylesheet: csswin,
            id: "win",
            typeEvent: "click",
            event: replay
        });

    });
});
