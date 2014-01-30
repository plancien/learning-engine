define(['event_bus'],function(eventBus)
{
    eventBus.on('createElement',function(params){
        var elemCreated=document.createElement(params.elem);
        elemCreated.style.cssText=params.stylesheet || "";
        elemCreated.id= params.id || Math.floor(Math.random()*1000)+" ";
        if(params.typeEvent)
            elemCreated.addEventListener(params.typeEvent,params.event);
        if(document.getElementById(params.parent))
            document.getElementById(params.parent).appendChild(elemCreated);
        else
            document.body.appendChild(elemCreated);
    });
});