
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
    
    eventBus.emit('init bad bonus',  'images/homer.png');
    eventBus.emit('init good bonus', 'images/burns.png');
    
    game.init = function () {
        var container = $('<div id="game_container"></div>');
        $('body').append(container);
        eventBus.emit('init', container);
    };
    
    
    return game; 
    
});