define(['event_bus'], function (eventBus) {
    
    var badUrl;
    var goodUrl;
    
    eventBus.on('init bonus', function (isGood, url) {
        if (isGood) {
            goodUrl = url;
        } else {
            badUrl  = url;
        }
    });
    

    eventBus.on('need new bonus', function () {
        if (Math.random() < 0.5) {
            eventBus.emit('add bonus', true, goodUrl);
        } else {
            eventBus.emit('add bonus', false, badUrl);
        }
    });
    
});
