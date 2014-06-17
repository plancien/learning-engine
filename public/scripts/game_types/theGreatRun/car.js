define(['event_bus', 'modules/imageLoader'], function(eventBus, imageLoader){
    function Car(params) {
        this.x = params.x;
        this.y = params.y;
        this.speed = params.speed;
        this.width = 75;
        this.height = 75;
        this.sourceX = Math.round(Math.random() * 8) * 48;
        this.direction = params.direction;
        this.rotation = Math.PI / 2;
        if (this.direction === "left") this.rotation = -this.rotation;


        eventBus.emit("init render", {
            object: this,
            sprite: {
                x: this.sourceX,
                y: 0,
                width: 48,
                height: 48,
                img: imageLoader("cars.png")
            },
            rotating: true
        });

        this.move = function() {
            var direction = this.direction === "left" ? -1 : 1;
            this.x += this.speed * 1.5 * direction;
            if (direction === 1 && this.x >= 875) {
                this.x = -75;
            } else if (direction === -1 && this.x <= -75) {
                this.x = 875;
            }
        };
    };
    return Car;
});    	
