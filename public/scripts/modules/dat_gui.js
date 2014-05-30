define(["scripts/ext_libs/dat.gui.js"], function(GUI){
    "use strict";
    console.log(GUI,dat)
    return function createGui(object) {
        var gui = new dat.GUI();
        for(var key in object) {
            if (object[key]>0 &&object[key]<1) {
                gui.add(object, key,0,1);
            } else {
                gui.add(object, key);
            }
            
        }
        return gui
    }
    
});