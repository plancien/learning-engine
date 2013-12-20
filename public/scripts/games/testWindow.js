/*

@name 
    [TEST] Window 
@endName

@description
    Testing game for the window module.
@endDescription

*/

define([
    'event_bus',
    'modules/window_size'
], function (eventBus, window_size) {

    eventBus.emit('get');
    window.onresize = function () {
        eventBus.emit('get');
    };
});