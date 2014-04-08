define(['event_bus'], function(eventBus) {

    var badUrl = [];
    var goodUrl = [];

    eventBus.on('init bonus', function(isGood, url) {
        if (isGood) {
            goodUrl.push(url);
        } else {
            badUrl.push(url);
        }
    });


    eventBus.on('need new bonus', function() {
        if (Math.random() < 0.5) {
            eventBus.emit('add bonus', true, goodUrl[Math.floor(Math.random()*goodUrl.length)]);
        } else {
            eventBus.emit('add bonus', false, badUrl[Math.floor(Math.random()*badUrl.length)]);
        }
    });

});
