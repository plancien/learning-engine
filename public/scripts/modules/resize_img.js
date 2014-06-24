define([], function(){
    "use strict";
    

    return function resizeImage(img,width,height,ratio, circle) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        if (circle){
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.globalCompositeOperation = "source-in";
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
      return canvas
    }

});