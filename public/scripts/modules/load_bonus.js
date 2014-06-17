define(["modules/img_loader"], function(load){
    "use strict";
    
    var usage = 0

    return function(bonus) {
        usage++;
        var names = [];
        for (var i = bonus.length - 1; i >= 0; i--) {
            var name = "bonus_"+usage+"_"+i
            names.push(name);
            load.add(bonus[i],name);
        };
        return names
    }
});