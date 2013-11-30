
// available modules
//    'modules/frames',
//    'modules/key_listener',
//    'modules/canvas',

define([
    'event_bus',
    'connector',
    'modules/events_list',
    'modules/simpsons'
], function (eventBus, socket) {
    
    var game = {};
    
    game.init = function () {
        var container = $('<div id="game_container"></div>');
        $('body').append(container);
        eventBus.emit('init', container);
    };    
    
    return game; 
    
});