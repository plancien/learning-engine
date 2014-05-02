define(['event_bus'], function(eventBus) {

    function Canvas() {
        this.defaultWidth = 500;
        this.defaultHeight = 300;
        this.defaultId = "main_canvas";
    }

    Canvas.prototype.create = function(params) {
        if (typeof params !== "object") params = {};

        var id = params.id || this.defaultId;
        var width = params.width || this.defaultWidth;
        var height = params.height || this.defaultHeight;

        var canvas = $('<canvas id=' + id + ' width=' + width + ' height=' + height + '></canvas>');

        if (params.container) params.container.append(canvas);
        else $('#container').append(canvas);

        var object = {
            canvas: canvas[0],
            $canvas: canvas,
            context: canvas[0].getContext('2d')
        };

        eventBus.emit('newCanvas', object);

        return object;
    };

    return new Canvas();
});
