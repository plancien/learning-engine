define([
    'event_bus',
    "tools",
    "frames"
], function(eventBus,tools) {

	function moveToTarget (object,target,speed,delay) {
		if (typeof object !== "object") {
			throw new Error("Calling moveToTarget() without a valid object to move,\n 1rst paramater must be object with readable x and y, or an array with array[0] = x and array[1] = y")
		}
		else if (typeof target === "object") {
			if (typeof target[0] === "number") {

			};
		};	
	}

});

