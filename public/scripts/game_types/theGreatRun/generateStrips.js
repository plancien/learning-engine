define(['event_bus', 'game_types/theGreatRun/strips', 'game_types/theGreatRun/car'], 
function(eventBus, Strip, Car){
    function generateStrips(offset, strips, cars) {
        var pausePosition = Math.round(2 + Math.random() * 3);
        var direction = Math.round(Math.random()) ? "left" : "right";

        strips.push(new Strip({
            y: 37.5 + offset,
            type: "grass"
        }));
        for (var i = 1; i < 7; i++) {
            if (pausePosition === i) {
                strips.push(new Strip({
                    y: 37.5 + pausePosition * 75 + offset,
                    type: "grass"
                }));
                continue;
            }
            var strip = new Strip({
                y: 37.5 + i * 75 + offset,
                type: "road",
                direction: direction
            });
            strips.push(strip);
            var chosenPattern = patterns[strip.carsNumber][Math.floor(Math.random() * patterns[strip.carsNumber].length)];
            for (var j = 0; j < strip.carsNumber; j++) {
                var car = new Car({
                    y: strip.y,
                    x: chosenPattern[j],
                    speed: strip.carSpeed,
                    direction: strip.direction
                });
                cars.push(car);
            }
        }
    };
    return generateStrips;
});    	

