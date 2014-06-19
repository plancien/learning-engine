define([], function(){
	var gradient = function(context){
		var list = {};

		list.arcEnCiel = context.createLinearGradient(0,0,400,400);
        list.arcEnCiel.addColorStop(0, '#00ABEB'); 
        list.arcEnCiel.addColorStop(0.33, '#fff'); 
        list.arcEnCiel.addColorStop(0.66, '#26C000'); 
        list.arcEnCiel.addColorStop(1, '#fff');

		list.firstBase = context.createLinearGradient(0,0,600,300);
        list.firstBase.addColorStop(0, '#0F0'); 
        list.firstBase.addColorStop(0.33, '#088'); 
        list.firstBase.addColorStop(0.66, '#04B'); 
        list.firstBase.addColorStop(1, '#00F');

        return list;
	}
	return gradient;
});    	