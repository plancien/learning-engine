define(['event_bus'], function(eventBus){
    function Bonus(params) {
        this.x = params.x;
        this.y = params.y;
        this.width = 60;
        this.height = 60;
        this.good = params.good;
        this.points = this.good ? 15 : -20;
        this.image = params.good ? bonusImage : malusImage;

        eventBus.emit("init render", {
            object: this,
            sprite: {
                x: 0,
                y: 0,
                width: this.image.width,
                height: this.image.height,
                img: this.image
            }
        });
    }

	function generateBonuses(offset, bonuses) {
        var moreBonusesNumber = Math.round(Math.random() * 2);
        var x = 75 / 2 + Math.round(Math.random() * 10) * 75;
        var y = 75 / 2 + Math.round(Math.random() * 8) * 75;

        x = 200;

        bonuses.push(new Bonus({
            x: x,
            y: y + offset,
            good: true
        }));
        x = 75 / 2 + Math.round(Math.random() * 10) * 75;
        y = 75 / 2 + Math.round(Math.random() * 8) * 75;
        bonuses.push(new Bonus({
            x: x,
            y: y + offset,
            good: false
        }));
        for (var i = 0; i < moreBonusesNumber; i++) {
            x = 75 / 2 + Math.round(Math.random() * 10) * 75;
            y = 75 / 2 + Math.round(Math.random() * 8) * 75;
            var good = Math.round(Math.random());
            bonuses.push(new Bonus({
                x: x,
                y: y + offset,
                good: good
            }));
        }
    }
    return generateBonuses;
});