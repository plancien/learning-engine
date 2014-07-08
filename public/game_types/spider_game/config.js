define([], function(){
    "use strict";
    
    return {
        size_img: 66,
        canvasWidth: 600,
        canvasHeight: 800,
        maxRopeDistance: 300,
        gravity: 0.001,
        scrollingSpeed : 0.1,
        playerScroll : 500,
        stepBetweenAnchors: 48,
        draw : {
            ropeStroke : "#FF0000",  
            ropeWidth : 3,
            anchorsStroke : "rgba(255,0,255,0.7)",
            achorsWidth : 2
        }
    }

});