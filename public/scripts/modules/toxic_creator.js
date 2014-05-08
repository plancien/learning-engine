define(['event_bus'], function(eventBus) {

    var toxicBoxes = [];

    eventBus.on('init toxicBox', function(isToxic, url) { 
        toxicBoxes.push(url); 
    });


    eventBus.on('need new toxicBox', function() {
            eventBus.emit('add toxicBox', true, toxicBoxes[Math.floor(Math.random()*toxicBoxes.length)]);
    });
});
