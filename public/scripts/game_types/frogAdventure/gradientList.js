define([], function(){
	var gradient = function(context){
		var list = {};

		list.rainbow = context.createRadialGradient(400, 300, 0, 400, 300, 400);
        list.rainbow.addColorStop(0, 	'#0F0'); 
        list.rainbow.addColorStop(0.2, 	'#0FF'); 
        list.rainbow.addColorStop(0.4, 	'#00F'); 
        list.rainbow.addColorStop(0.6, 	'#F0F'); 
        list.rainbow.addColorStop(0.8, 	'#F00'); 
        list.rainbow.addColorStop(1, 	'#FF0'); 

		list.invertRainbow = context.createRadialGradient(400, 300, 0, 400, 300, 400);
        list.invertRainbow.addColorStop(1, 	'#0F0'); 
        list.invertRainbow.addColorStop(0.8, 	'#0FF'); 
        list.invertRainbow.addColorStop(0.6, 	'#00F'); 
        list.invertRainbow.addColorStop(0.4, 	'#F0F'); 
        list.invertRainbow.addColorStop(0.2, 	'#F00'); 
        list.invertRainbow.addColorStop(0, 	'#FF0'); 

        return list;
	}
	return gradient;
});    	