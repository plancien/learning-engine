define(['event_bus'], function (eventBus) {

    /**
     * [Gauge constructor]
     * @param {Object} data [data contains all the gauge attributes]
     */
    var Gauge = function(data){
        this.color = data.color || "green";
        this.context = data.context;
        this.strokeColor = data.strokeColor || "black";
        this.currentValue = data.currentValue || data.valueMax || 0;
        this.valueMax = data.valueMax || data.currentValue || 0;
        this.valueMin = data.valueMin || data.currentValue || 0;
        this.gaugeId = data.gaugeId || Gauge.count;
        this.position = data.position || {x : 0, y : 0};
        this.size = data.size || {x : 0, y : 0};
        this.displayMode = data.displayMode || "vertical";

        Gauge.count++;
        this.startListening();
    };

    Gauge.count = 0;

    /**
     * [startListening is a method which launch all the "on" methods needed by our Gauge instance]
     * @return {undefined} [undefined]
     */
    Gauge.prototype.startListening = function(){
        var _self = this;

        eventBus.on("new frame", _self.run, _self);
    }

    /**
     * [draw the gauge]
     * @return {undefined} [undefined]
     */
    Gauge.prototype.draw = function(){
            var _self = this;

            var color = _self.color;
            var context = _self.context;

            context.clearRect(_self.position.x, _self.position.y, _self.size.x, _self.size.y);

            if(_self.displayMode === "vertical"){
                var height = _self.currentValue/_self.valueMax*_self.size.y;
                var positionY = _self.position.y + (_self.size.y - height);

                context.fillStyle = color;
                context.fillRect(_self.position.x, positionY, _self.size.x, height);
            }
            else{
                var width = _self.currentValue/_self.valueMax*_self.size.x;

                context.fillStyle = color;
                context.fillRect(_self.position.x, _self.position.y, width, _self.size.y);
            }

            var strokeColor = _self.strokeColor;

            context.strokeStyle = strokeColor;
            context.strokeRect(_self.position.x, _self.position.y, _self.size.x, _self.size.y);
    }

    /**
     * [check and dispatch all the gauge events]
     * @return {undefined} [undefined]
     */
    Gauge.prototype.checkGauge = function(){
        var _self = this;

        if(_self.currentValue >= _self.valueMax){
            _self.full = true;
            eventBus.emit("gauge is full"+_self.gaugeId, _self.currentValue);
        }
        else if(_self.currentValue <= _self.valueMin){
            _self.empty = true;
            eventBus.emit("gauge is empty"+_self.gaugeId, _self.currentValue);
        }
        else{
            if(_self.full){
                _self.full = false;
                eventBus.emit("gauge full to stable"+_self.gaugeId, _self.currentValue);
            }
            else if(_self.empty){
                _self.empty = false;
                eventBus.emit("gauge empty to stable"+_self.gaugeId, _self.currentValue);
            }
        }
    }

    /**
     * [run method called every frame]
     * @return {undefined} [undefined]
     */
    Gauge.prototype.run = function(){
        var _self = this;

        _self.draw();
        _self.checkGauge();
    }

    return Gauge;
});