define(['event_bus'], function (eventBus) {

    eventBus.on('get', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        eventBus.on(width);
        eventBus.on(height);
    });

});