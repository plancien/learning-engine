define([
    'event_bus',
    'modules/score',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function(eventBus) {

    function Collectible(x, y, id, url, trigger) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.url = url;
        this.trigger = trigger;

        this.draw = function() {
            img = new Image();
            img.src = url;
            img.onload = function() {
                canvas.context.drawImage(img, X, Y, width, height);
            };
        };
    }

    eventBus.on("new collectible", function(x, y, id, url, trigger) {
        new Collectible(x, y, id, url, trigger);
    });

});
