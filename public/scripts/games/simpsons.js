/*

@name 
    Simpsons
@endName

@description
    Basic game, just click on Mr Burns and take care of Homer !
@endDescription

*/

define([
    'event_bus',
    'modules/score',
    'modules/bonus_chooser',
    'modules/bonus_fader'
], function(eventBus) {

    eventBus.emit('init bonus', false, 'images/homer.png');
    eventBus.emit('init bonus', true, 'images/burns.png');

    eventBus.on('add bonus', function(good, url) {
        var htmlClass = good ? 'good' : 'bad';
        var bonus = $('<img class="' + htmlClass + '" src="' + url + '" />');
        bonus.css({
            left: Math.random() * 500 + 'px',
            top: Math.random() * 300 + 'px'
        });
        container.append(bonus);
        eventBus.emit('bonus added', bonus);
    });

    function gameLoop() {
        eventBus.emit('need new bonus');
        setTimeout(gameLoop, 200 + Math.random() * 300);
    }

    var container;
    eventBus.on('init', function(_container) {
        container = _container;
        gameLoop();

        $('body').on('mousedown', '.good, .bad', function(e) {
            e.preventDefault();
        });

        $('body').on('click', '.good, .bad', function() {
            $(this).remove();
            if ($(this).hasClass('good')) {
                eventBus.emit('add points', 1);
            } else {
                eventBus.emit('add points', -3);
            }
        });
    });

});
