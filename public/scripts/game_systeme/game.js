define(['event_bus'], function(eventBus) {

    var game = {};

    game.init = function(question) {
        var question = "<h1 class='game_question'> "+question+"<h1/>"
        $('#main').prepend(question);
        var container = $('<div id="game_container" style="float : left;"></div>');
        $('#container').append(container);
        $('</br><button id="retour" class="button">Retour</button>').appendTo("body");
        $("#retour").click(function(e) {
        	location.reload();
        });
        eventBus.emit('init', container);
    };

    return game;

});
