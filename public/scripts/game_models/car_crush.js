/*

@name 
    Car crush
@endName

@description
    Crush the images with your yolo-car X2000 power Z ulra storm.
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/score',
    'modules/bonus_chooser',
    'modules/move'

], function (eventBus, canvasManager) {
    
    return function(params)
    {
        var canvas, ctx;

        var bonusPoints = parseInt($("#bonusPoints")[0].value) || 1;
        var malusPoints = parseInt($("#malusPoints")[0].value) || -3;

        eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true,  params.malusUrl);

        eventBus.on("init", function() {
            canvas = canvasManager.create({
                width : 600,
                height : 600
            });

            ctx = canvas.context;
        });

        var Bonus = function Bonus(isBonus, url)
        {
            this.bonus = isBonus;
            this.img = new Image();
            this.img.src = "url(" + url + ")";

            console.log(this.img);
        }

        eventBus.on('add bonus', function (good, url) {
            var isBonus = good ? true : false;        
            var bonus = new Bonus(isBonus);      
            
        });

        function gameLoop () {
            eventBus.emit('need new bonus');
            setTimeout(gameLoop, 200 + Math.random()*300);
        }

    }

});

        