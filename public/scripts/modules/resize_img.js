define([], function(){
    "use strict";
    

    return function resizeImage(img,width,height,ratio, circle, addStroke) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        if (circle){
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI);
            // ctx.fillStyle = 'red';
            // ctx.fill();
            ctx.clip();
        }
        if(ratio==="crop" || ratio === "fit") {
            var scaleX = width/img.width;
            var scaleY = height/img.height;
            var XbiggerThanY = scaleY - scaleX;
            XbiggerThanY*= ratio==="crop" ? -1 : 1;
            if (XbiggerThanY>0) {
                var offsetY = (height-img.height*scaleX)*0.5;
                ctx.drawImage(img, 0, offsetY, width, img.height*scaleX);
            } else {
                var offsetX = (height-img.width*scaleY)*0.5;
                ctx.drawImage(img, offsetX, 0, img.width*scaleY, height);
            }
        } else {
            ctx.drawImage(img,0,0,width,height);
        }
        if (addStroke){
            ctx.strokeStyle = addStroke || "black";
            ctx.lineWidth = 5;
            if (circle)
                ctx.arc(width/2, height/2, width/2, 0, 2*Math.PI);
            else
                ctx.rect(0,0,width,height);
            
            ctx.stroke();
        }
      return canvas;
    }

});