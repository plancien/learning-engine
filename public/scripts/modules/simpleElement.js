 define(['event_bus'], function(eventBus) {

	var ElementEngine = function(){
		this.content = [];
	}
	ElementEngine.prototype.create = function(x,y,width,height, type, color){
		var element = {};
		element.x = x || 0;
		element.y = y || 0;
		element.width = width || 100;
		element.height = height || 50;
		element.color = color || "black";
		element.type = type;
		this.content.push(element);
		eventBus.emit(type + " create", element);
	}
	return new ElementEngine();
});