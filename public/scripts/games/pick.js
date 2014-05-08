/*

@name 
   Pick
@endName

@description
  put the pictures in the right boxes
@endDescription

*/

define([
    'event_bus',
    'modules/score',
    'modules/collisions',
    'modules/bonus_chooser',
    'modules/bonus_fader',
    'modules/healbox_creator',
    'modules/toxic_creator',
    'modules/dragndrop'

], function(eventBus) {

    eventBus.emit('init bonus', false, 'images/homer.png');
    eventBus.emit('init bonus', true, 'images/burns.png');
    eventBus.emit('init healBox', true, 'images/healBox.png');
    eventBus.emit('init toxicBox', true, 'images/toxicBox.png');
    eventBus.emit( 'images/box.png');

    eventBus.emit('need new healBox');
    eventBus.emit('need new toxicBox');

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

    eventBus.on('add healBox', function(url) {
        var htmlClass = 'heal';
        var healBox = $('<img class="' + htmlClass + '" src="' + url + '" />');
        box.css({
            left: Math.random() * 1000 + 'px',
            top: Math.random() * 300 + 'px'
        });
        container.append(healBox);
        eventBus.emit('healBox added', healBox);  
    });

      eventBus.on('add toxicBox', function(url) {
        var htmlClass = 'toxic';
        var toxicBox = $('<img class="' + htmlClass + '" src="' + url + '" />');
        box.css({
            left: Math.random() * 100 + 'px',
            top: Math.random() * 300 + 'px'
        });
        container.append(toxicBox);
        eventBus.emit('toxicBox added', toxicBox);  
    });

    function gameLoop() {
        eventBus.emit('need new bonus');
        setTimeout(gameLoop, 1000 + Math.random() * 300);
    }

    var container;
    eventBus.on('init', function(_container) {
        container = _container;
        gameLoop();


        // if (collisions.CollisionSquares($('body').on, healBox)){
        //     if ($(this).hasClass('heal')) {
        //         eventBus.emit('add points', 1);
        //     } else {
        //         eventBus.emit('add points', -3);
        //     }
        // }

        // if (collisions.CollisionSquares($('body').on, toxicBox)){
        //     if ($(this).hasClass('toxic')) {
        //         eventBus.emit('add points', 1);
        //     } else {
        //         eventBus.emit('add points', -3);
        //     }
        // }
  
    });

});