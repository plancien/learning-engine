define(['event_capabilities'], function (addEventCapabilities) {
    
    var eventBus = {};
    addEventCapabilities(eventBus);
    
    return eventBus; 
    
});