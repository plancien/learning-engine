define(['event_bus'], function(eventBus) {
    

    /**********************************************
    	Add eventBus.emit('outside canvas',{canvas:myCanvas,target:myTarget}); to use it.
    		WATCHOUT /!\
    			myTarget is an object as this {x:NUMBER,y:NUMBER,w:NUMBER,h:NUMBER}; 
    		SUCCESS NOT GUARANTEED IF NOT STRUCTURED LIKE THIS
    	Will send an object 
    		object.isOutOnX = true/false,
    		object.isOutOnY = true/false 
    	To catch the response add,
    	eventBus.on('outside canvas response',function(params){
			if(params.isOutOnX){
	
			}
			if(params.isOutOnY){
	
			}
    	});
    **********************************************/
    eventBus.on('outside canvas', function(params) {
    	var canvas = params.canvas;
    	var target = params.target;
    	var paramsToSend = {
    		isOutOnX:false,
    		isOutOnY:false
    	};
    	if(!target.w){
    		target.w = target.width || 0;
    	}
    	if(!target.h){
    		target.h = target.height || 0;
    	}
    	if(target.x < 0 ||
    		target.x+target.w > canvas.width){
    		params.isOutOnX = true;
    	}
    	if(target.y < 0 ||
    		target.y+target.h > canvas.height){
    		paramsToSend.isOutOnY = true;
    	}
    	eventBus.emit("outside canvas response", paramsToSend);
    });
    
});
