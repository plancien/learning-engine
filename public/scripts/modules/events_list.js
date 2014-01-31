define(['event_bus'], function(eventBus) {

    var container = $('<div id="eventsList"></div>');

    eventBus.on('init', function(mainContainer) {
        mainContainer.append(container);
    });


    eventBus.on('new event listener', function() {
        var s = '<ul>';
        for (var eventName in eventBus.listenersFor) {
            s += '<li>' + eventName + '<ul>';
            var listeners = eventBus.listenersFor[eventName];
            for (var i = 0; i < listeners.length; i++) {
                s += '<li>' + listeners[i].origin + '</li>';
            };
            s += '</ul></li>';
        }

        container.html(s + '</ul>');
    });

});
