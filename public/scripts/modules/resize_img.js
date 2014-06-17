define([], function(){
    "use strict";
    

    return function resizeImage(img,width,height,ratio) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
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