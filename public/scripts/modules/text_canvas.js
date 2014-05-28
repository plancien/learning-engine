define([], function(){
    "use strict";
    
    return function createTextDisplay(height,color,font) {
        font = font || "monospace";
        color = color || "black";
        height = height || 24;

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.changeText = function(text) {
            canvas.width = text.length*height;
            canvas.height = height*height*2;

            ctx.font = ""+height+"pt "+font;
            ctx.fillStyle = color;

            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            ctx.fillText(text,5,5);
        }

        return canvas;
    }


});