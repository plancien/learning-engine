
// available modules
//    'modules/frames',
//    'modules/key_listener',
//    'modules/canvas',

define([
    'event_bus',
    'modules/events_list'
], function (eventBus) {
    
    var game = {};
    
    game.init = function (question, images) {
        $('body').append($('<h1>' + question + '</h1>'));
        var container = $('<div id="game_container"></div>');
        $('body').append(container);
        eventBus.emit('init', container);
        eventBus.emit("images loaded", images)
    };    
    
    return game; 
    
});