define(['event_capabilities'], function(addEventCapabilities) {

    var eventBus = {};
    addEventCapabilities(eventBus);
console.log(eventBus)
    return eventBus;

});
