define(['event_bus'], function (eventBus) {

    var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    
    var onEachFrame = function() {
        eventBus.emit('new frame');
        requestAnimationFrame(onEachFrame);
    };
    
    onEachFrame();

    
});
    