define(['event_bus', "connector"], function(eventBus, socket) {
    
    /*******************************************************************************************************
    Load all images in the images file
    *******************************************************************************************************/

    window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })()

    eventBus.on("load images", function(){

        socket.on("send images names", function(names) {

            var images = {
                imagesLoaded : 0
            }

            for(var i = 0; i < names.length; i++){
                var nameSplitted = names[i].split(".");
                var extension = nameSplitted[1];
                var smallName = nameSplitted[0];
                if(extension !== "png" && extension !== "jpg" && extension !== "gif"){
                    names.splice(i,1);
                    i--;
                    break;
                }
                images[smallName] = new Image();
                images[smallName].src = "./images/"+names[i];
                images[smallName].onload = function(){images.imagesLoaded++};
            }
            loadImages(images);
        })

        socket.emit("ask images names");
    });

    function loadImages (images){
        if(images.imagesLoaded >= Object.keys(images).length -1){
            delete(images.imagesLoaded);
            eventBus.emit("images loaded", images);
        }else{
            requestAnimFrame(function(){loadImages(images)});
        }
    }
});
