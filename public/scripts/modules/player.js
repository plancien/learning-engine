define(['event_bus','modules/playerTab'], function (eventBus) {

    function Player(properties) //where properties is an associative array ie : new Player({speed : "45", life : "10", spritesheet : "skin.png"})
    {
        for (var key in properties) {
            this[key] = properties[key]; //ie this.x = x;
        }
    
    // ****************** EMITERS ****************************
        function doDamage(id){
            eventBus.emit('damage' + id, this.damage);
        }

    // ****************** RECEIVERS ****************************

        eventBus.on('init player', function (properties) {
            playerTab.push(new Player(properties));
        });

        eventBus.on('damage' + this.id, function(damage) {
            this.hp -= damage;
            if (this.hp<= 0){
                eventBus.emit('player dead' + this.id);
            }
        }, this);

        eventBus.on('player dead' + this.id, function() {
            playerTab.splice(playerTab.indexOf(this["id"]),1);
        }, this);
    }
});