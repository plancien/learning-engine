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

    eventBus.on("load images", function(callback){

        socket.on("send images names", function(names) {

            var images = {
                imagesLoaded : 0
            }

            for(var i = 0; i < names.length; i++){
                var smallName = names[i].split(".")[0];
                images.files[smallName] = new Image();
                images.files[smallName].src = "./images/"+names[i];
                images.files[smallName].onload = function(){images.imagesLoaded++};
            }
            loadImages(callback, images);
        })

        socket.emit("ask images names");
    });

    function loadImages (callback, images){
        if(images.imagesLoaded >= Object.keys(images).length -1){
            delete(images.imagesLoaded);
            callback(images);
        }else{
            requestAnimFrame(function(){loadImages(callback, names)});
        }
    }
});
