define(["event_bus"], function(eventBus){
    "use strict";

    var buffer = {};


    function load(urls,callback) {
        extend(urls,buffer);
        var imgToLoad = 0;
        var imgLoaded = 0;
        var imgs = {};
        for (var key in urls) {
            (function() {
                var img = new Image();
                img.src = urls[key];
                img.addEventListener("load",onload);
                imgs[key] = img;
            })(key);
            imgToLoad++;
        };
        return imgs;

        function onload () {
            imgLoaded++
            if (imgToLoad===imgLoaded) {
                console.log(imgs.bonus_1_4);
                    
                callback && callback(imgs);
                eventBus.emit("images loaded",imgs);
            }
        }
    }

    load.add = function(item,name) {
        buffer[name] = item;
    }
    
    function extend(object,value) {
        for(var key in value) {
            if(!object[key]) {
                object[key] = value[key];
            }
        }

    }

    return load;
});