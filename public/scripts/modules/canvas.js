define(['event_bus'], function (eventBus) {

    var canvas;
    
    eventBus.on('init', function (mainContainer) {
        canvas = $('<canvas id="main_canvas" width="500" height="300"></canvas>');
        mainContainer.append(canvas);
    });
    
});
