define(['event_bus', 'connector'], function(eventBus, socket) {

    var score = 0;
    var scoreContainer;

    eventBus.on('init', function(mainContainer) {
        scoreContainer = $('<div id="score"></div>');
        mainContainer.append(scoreContainer);
    });

    eventBus.on('add points', function(points) {
        score += points;
        scoreContainer.html(score);
        socket.emit("update score", points);
    });

    eventBus.on("set score", function(points) {
        score = points;
        scoreContainer.html(score);
        socket.emit("update score", points);
    });

});
