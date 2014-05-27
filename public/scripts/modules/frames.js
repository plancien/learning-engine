define(['event_bus'], function(eventBus) {

    var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var updateDT = (function() {
        var old = Date.now();
        return function() {
            var now = Date.now();
            var dt = now-old;
            old = now;
            return dt;
        }
    })()

    var onEachFrame = function() {
            var dt = updateDT();
            eventBus.emit('new frame',dt);
            requestAnimationFrame(onEachFrame);
        };

    onEachFrame();

});
