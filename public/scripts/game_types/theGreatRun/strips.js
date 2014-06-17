define(['event_bus', 'modules/imageLoader'], function(eventBus, imageLoader){
    function Strip(params) {
        this.x = canvas.canvas.width / 2;
        this.y = params.y;
        this.width = this.x * 2;
        this.height = 75;
        this.type = params.type;
        this.direction = Math.round(Math.random()) ? "left" : "right";
        this.carsNumber = Math.round(1 + Math.random() * 3);
        this.carSpeed = Math.round(1 + Math.random() * 2);
        eventBus.emit("init render", {
            object: this,
            sprite: {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
                img: imageLoader(this.type+".png")
            },
            patternRepeat: "repeat"
        });
    };
    return Strip;
});        
