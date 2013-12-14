define(['event_bus'], function (eventBus) {

    eventBus.on('get', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        console.log('width: '+width+' height: '+height);
        eventBus.emit('width', width);
        eventBus.emit('height', height);
    });

});