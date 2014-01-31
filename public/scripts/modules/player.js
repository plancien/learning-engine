define(['event_bus', 'modules/playerTab'], function(eventBus) {

    function Player(properties) {

        //where properties is an associative array ie : new Player({speed : "45", life : "10", spritesheet : "skin.png"})
        for (var key in properties) {
            this[key] = properties[key]; //ie this.x = x;
        }

        function doDamage(id) {
            eventBus.emit('damage', this, this.damage);
        }
    }


    // ****************** RECEIVERS ****************************
    eventBus.on('init player', function(properties) { //New player :D
        playerTab.push(new Player(properties));
    });

    eventBus.on('player dead', function(player) { //Player dies :<
        playerTab.splice(playerTab.indexOf(player), 1);
    });

    eventBus.on('damage', function(player, damage) { //Player takes damages
        player.hp -= damage;
        if (player.hp <= 0) {
            eventBus.emit('player dead', player);
        }
    });

});
