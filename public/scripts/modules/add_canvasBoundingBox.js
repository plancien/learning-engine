define(['event_bus'], function(eventBus) {
    

    /**********************************************

    	Add eventBus.emit('outside canvas',{canvas:myCanvas,target:myTarget}); to use it.
    		WATCHOUT /!\
    			myTarget is an object as this {x:NUMBER,y:NUMBER,w:NUMBER,h:NUMBER}; 
    		SUCCESS NOT GUARANTEED IF NOT STRUCTURED LIKE THIS

    	Will send an object 
    		object.isEntirelyOutOnX = true/false,
    		object.isEntirelyOutOnY = true/false
            object.isPartiallyOutOnX = true/false,
            object.isPartiallyOutOnY = true/false,
            object.previewX = next position of target on X
            object.previewY = next position of target on Y
            object.oldX = position to set of target if colliding on X
            object.oldY = position to set of target if colliding on Y

    	To catch the response add,
    	eventBus.on('outside canvas response',function(params){
			if(params.isEntirelyOutOnX){
				//SPRITE ENTIRELY OUT OF THE CANVAS SCREEN ON THE X AXIS
			}
			if(params.isPartiallyOutOnX){
				//SPRITE IS PARTIALLY OUT OF THE CANVAS SCREEN ON THE X AXIS
			}
			if(params.isEntirelyOutOnY){
				//SPRITE IS ENTIRELY OUT OF THE CANVAS SCREEN ON THE Y AXIS
			}
			if(params.isPartiallyOutOnY){
				//SPRITE IS PARTIALLY OUT OF THE CANVAS SCREEN ON THE Y AXIS
			}

    	});
    **********************************************/
    eventBus.on('outside canvas', function(params) {
    	var canvas = params.canvas;
    	var target = params.target;
    	var paramsToSend = {
    		isEntirelyOutOnX: false,
    		isPartiallyOutOnX: false,
    		isEntirelyOutOnY: false,
    		isPartiallyOutOnY: false,
            previewX: params.target.x,
            previewY: params.target.y,
            oldX: params.target.oldX,
            oldY: params.target.oldY
    	};
    	//Try to change if forgot to make it w/h
    	if(!target.w){
    		target.w = target.width || 0;
    	}
    	if(!target.h){
    		target.h = target.height || 0;
    	}
    	//outside X
    	if(target.x+target.w < 0 ||
    		target.x > canvas.width){
    		params.isEntirelyOutOnX = true;
    	}
    	if(target.x < 0 ||
    		target.x+target.w > canvas.width){
    		paramsToSend.isPartiallyOutOnX = true;
    	}
    	//outside Y
    	if(target.y+target.h < 0 ||
    		target.y > canvas.height){
    		paramsToSend.isEntirelyOutOnY = true;
    	}
    	if(target.y < 0 ||
    		target.y+target.h > canvas.height){
    		paramsToSend.isPartiallyOutOnY = true;
    	}
    	eventBus.emit("outside canvas response", paramsToSend);
    });
    
});
