define(['event_bus'], function(eventBus) {

    var keysDown = {};

    var keyCodes = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    window.addEventListener("keydown", function(e) {
        var niceCode = keyCodes[e.keyCode] || e.keyCode;
        keysDown[niceCode] = true;
        eventBus.emit('key pressed', niceCode);
        eventBus.emit('key pressed ' + niceCode);
    }, false);

    window.addEventListener("keyup", function(e) {
        var niceCode = keyCodes[e.keyCode] || e.keyCode;
        delete keysDown[e.keyCode];
    }, false);

    eventBus.on('new frame', function() {
        var keys = [];
        for (keyCode in keysDown) {
            keys.push(keyCode);
        }
        eventBus.emit('keys still pressed', keys);
    });

});
