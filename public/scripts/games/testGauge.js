/*

@name 
    [TEST] Gauge 
@endName

@description
    Testing game for the gauge module.
@endDescription

*/

define([
    'event_bus',
    'modules/gauge',
    'modules/canvas',
    'modules/frames',
    'modules/mouse'
], function (eventBus, Gauge, Canvas, frames, Mouse) {

    var canvas = Canvas.create();
    var gauge = new Gauge({
        context : canvas.context,
        size : {
            x : 100,
            y : 100
        },
        valueMax : 100,
        displayMode : "horizontal"
    });
    var gauge2 = new Gauge({
        context : canvas.context,
        size : {
            x : 100,
            y : 100
        },
        position : {
            x : 110,
            y : 0
        },
        valueMax : 1000,
    });


    eventBus.on("new frame", function(){
        gauge.currentValue--;
        gauge2.currentValue--;
    })

    eventBus.on("gauge is empty"+gauge.gaugeId, function(){
        this.currentValue = this.valueMax;
    }, gauge)

    eventBus.on("gauge is empty"+gauge2.gaugeId, function(){
        this.currentValue = this.valueMax;
    }, gauge2)

});
