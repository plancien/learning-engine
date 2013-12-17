define(['event_bus'], function (eventBus) {

    var score = {
        value : 0,
        multi : 1,
    }
    
    eventBus.on("add score", function(score) {
        score.value += score  * score.multi;
    });
    
    eventBus.on("lost score", function(score) {
        score.value -= score;
    });
        
    eventBus.on("multiplicator", function(multi) {
        score.multi = multi;
    });
    
    return score;

});