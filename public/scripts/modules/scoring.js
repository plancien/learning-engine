define(['event_bus'], function (eventBus) {

    var score = {
        value : 0,
        multi : 1,
    }
    
    eventBus.on("add score", function(param) {
        score.value += param.score  * score.multi;
    });
    
    eventBus.on("lost score", function(param) {
        score.value -= param.score;
    });
        
    eventBus.on("multiplicator", function(param) {
        score.multi = param.multi;
    });
    
    return score;

});