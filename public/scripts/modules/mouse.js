define(['event_bus'], function(eventBus) {
    
    var Mouse = function ()
    {
        //position of the mouse in the window
        this.x = 0;
        this.y = 0;
        //position in the canvas
        this.canvasX = 0;
        this.canvasY = 0;
        this.isClicking = false;
    }
    function addMouseCapabilities (object)
    {
        object.prototype.update = function (event)
        {
            //to not consider the size of the page
            var totalOffsetX = 0;
            var totalOffsetY = 0;
            //calculating the position on the canvas
            var currentElement = this;
            var e = event || window.event;
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
            //update of the mouse attributes
            this.x = e.pageX;
            this.y = e.pageY;
            this.canvasX = e.pageX - totalOffsetX;
            this.canvasY = e.pageY - totalOffsetY;
            eventBus.emit('mouse', this);
        }
        object.prototype.keydown = function (event)
        {
            this.isClicking = true;
            eventBus.emit('clicking', this.isClicking);
        }
        object.prototype.keyUp = function (event)
        {
            this.isClicking = false;
            eventBus.emit('clicking', this.isClicking);
        }
    }

    eventBus.on('init', function () {
        addMouseCapabilities(Mouse);
        var mouse = new Mouse();
        window.addEventListener("mousemove", mouse.update, false);
        window.addEventListener("mousedown", mouse.keyDown, false);
        window.addEventListener("mouseup", mouse.keyUp, false);
        eventBus.emit('mouse', mouse);
    });   
});






