define(["scripts/ext_libs/dat-gui/build/dat.gui.js"], function(GUI){
    "use strict";
    console.log(GUI,dat)
    return function createGui(object) {
        var gui = new dat.GUI();
        for(var key in object) {
            gui.add(object, key);
        }
        return gui
    }
    
});