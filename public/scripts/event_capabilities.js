define(function() {

    function addEventCapabilities(object) {

        object.listenersFor = {};

        object.on = function(eventName, callback, instance) {
            if (!this.listenersFor[eventName]) {
                this.listenersFor[eventName] = [];
            }
            var e = new Error('fake error');
            var origin = e.stack ? e.stack.split("\n")[2] : undefined;
            this.listenersFor[eventName].push({
                origin:   origin,
                callback: callback,
                instance : instance
            });
            
            object.emit('new event listener', eventName);
        };

        object.emit = function() {
            var args = Array.prototype.slice.call(arguments);
            var eventName = args.shift();
            var listeners = object.listenersFor[eventName] || [];
            
            for (var i = 0; i < listeners.length; i++) {
                try {
                    var newArgs = listeners[i].callback.apply(listeners[i].instance || object, args);
                    if (newArgs === false) {
                        break;
                    } else if (typeof newArgs !== 'undefined') {
                        args = newArgs;
                    }
                } catch (e) {
                    console.error('Error in on.'+eventName+' '+listeners[i].origin + "\n");
                    throw (e);
                }
            };
        };

    };
    
    return addEventCapabilities;

});