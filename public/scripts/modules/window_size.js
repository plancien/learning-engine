define(['event_bus'], function(eventBus) {

    function WindowSize() {
        this.defaultWidth = 500;
        this.defaultHeight = 300;
    }

    WindowSize.prototype.getWindowSize = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var object = {
            width: width,
            height: height
        };

        return object;
    };

    return new WindowSize();
});
