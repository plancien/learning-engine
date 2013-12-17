define(['event_bus'], function (eventBus) {

    function Player(properties)
    {
        //All the properties of the player that will be pushed at its creation
        for (var key in properties) {
            this[key] = properties[key];
            finalProperties.push(properties[key]);
        }
    }

    eventBus.on('init player', function (properties) {
        playerTab.push(new Player(properties));
    });
});