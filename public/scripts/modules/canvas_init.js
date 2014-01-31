define(['event_bus', 'modules/canvas'], function(eventBus, Canvas) {

    var canvas;
    eventBus.on('init', function(mainContainer) {
        canvas = Canvas.create({
            container: mainContainer
        });
    });

});
