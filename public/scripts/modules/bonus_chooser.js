define(['event_bus'], function (eventBus) {
    
    var badUrl;
    var goodUrl;
    
    eventBus.on('init bad bonus', function (url) {
        badUrl  = url;
    });
    
    eventBus.on('init good bonus', function (url) {
        goodUrl = url;
    });
    

    eventBus.on('need new bonus', function () {
        if (Math.random() < 0.5) {
            eventBus.emit('add bonus', true, goodUrl);
        } else {
            eventBus.emit('add bonus', false, badUrl);
        }
    });
    
});
