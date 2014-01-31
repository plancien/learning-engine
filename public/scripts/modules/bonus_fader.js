define(['event_bus'], function(eventBus) {

    eventBus.on('bonus added', function(bonus) {
        bonus.hide().fadeIn();

        setTimeout(function() {
            bonus.fadeOut();
        }, 2000);
    });

});
