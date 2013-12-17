define(['event_bus'], function (eventBus) {

    function Player(properties)
    {
        for (var key in properties) {
            this[key] = properties[key]; //ie this.x = x;
        }
    }

    eventBus.on('init player', function (properties) {
        playerTab.push(new Player(properties));
    });
});