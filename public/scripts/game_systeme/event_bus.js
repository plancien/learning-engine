define(['event_capabilities',"connector"], function(addEventCapabilities,socket) {

    var eventBus = {};
    addEventCapabilities(eventBus);
    return eventBus;

});
