define(['event_bus'], function(eventBus) {

    var healBoxes = [];

    eventBus.on('init healBox', function(isHeal, url) { 
        healBoxes.push(url); 
    });


    eventBus.on('need new healBox', function() {
            eventBus.emit('add Healbox', true, healBoxes[Math.floor(Math.random()*healBoxes.length)]);
    });
});
