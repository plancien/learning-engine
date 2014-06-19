define(['event_bus'], function(eventBus) {

    getCanvas = {};

    eventBus.on('newCanvas', function(canvas) {
        getCanvas = canvas;
    });

    function Mouse() {
        //position of the mouse in the window
        this.btns = {
            "0": "left",
            "1": "wheel",
            "2": "right"
        };
        this.x = 0;
        this.y = 0;
        //position in the canvas
        this.canvasX = 0;
        this.canvasY = 0;
        this.isClicking = {
            "left": false,
            "right": false,
            "wheel": false
        };
    }

    Mouse.prototype.update = function(event) {
        //to not consider the size of the page
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        //calculating the position on the canvas
        
        var currentElement = getCanvas ? getCanvas.canvas : window;

        var e = event || window.event;
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        //update of the mouse attributes
        this.x = e.pageX;
        this.y = e.pageY;
        this.canvasX = this.x - totalOffsetX;
        this.canvasY = this.y - totalOffsetY;
        eventBus.emit('mouse update', {
            "x": this.x,
            "y": this.y,
            "canvasX": this.canvasX,
            "canvasY": this.canvasY,
            "isClicking": this.isClicking
        });
    };

    Mouse.prototype.clickDown = function(event) {
        if (!this.isClicking[this.btns[event.button]]) {
            eventBus.emit('mouse ' + this.btns[event.button] + ' start clicking', this);
        }
        this.isClicking[this.btns[event.button]] = true;
        eventBus.emit('mouse ' + this.btns[event.button] + ' is clicking', this);
    };

    Mouse.prototype.clickUp = function(event) {
        this.isClicking[this.btns[event.button]] = false;
        eventBus.emit('mouse ' + this.btns[event.button] + ' stop clicking', this);
    };

    eventBus.on('init', function() {
        var mouse = new Mouse();
        window.addEventListener("mousemove", mouse.update.bind(mouse), false);
        window.addEventListener("mousedown", mouse.clickDown.bind(mouse), false);
        window.addEventListener("mouseup", mouse.clickUp.bind(mouse), false);
        
        eventBus.emit('mouse is created', mouse);
    });

});
