define([], function(){
    var gradient = function(context){
        var list = {};

        list.rainbow = context.createLinearGradient(0,0,800,600);
        list.rainbow.addColorStop(0,    '#0F0'); 
        list.rainbow.addColorStop(0.2,  '#0FF'); 
        list.rainbow.addColorStop(0.4,  '#00F'); 
        list.rainbow.addColorStop(0.6,  '#F0F'); 
        list.rainbow.addColorStop(0.8,  '#F00'); 
        list.rainbow.addColorStop(1,    '#FF0'); 

        list.invertRainbow = context.createLinearGradient(0,0,800,600);
        list.invertRainbow.addColorStop(0,  '#FF0'); 
        list.invertRainbow.addColorStop(0.2, '#F00'); 
        list.invertRainbow.addColorStop(0.4,    '#F0F'); 
        list.invertRainbow.addColorStop(0.6,    '#00F'); 
        list.invertRainbow.addColorStop(0.8,    '#0FF'); 
        list.invertRainbow.addColorStop(1,  '#0F0'); 

        list.boxColor = context.createLinearGradient(0,0,800,600);
        list.boxColor.addColorStop(0,'#FFF'); 
        list.boxColor.addColorStop(1,  '#000'); 

        list.invertBoxColor = context.createLinearGradient(0,0,800,600);
        list.invertBoxColor.addColorStop(0,  '#000'); 
        list.invertBoxColor.addColorStop(1,'#FFF'); 

        return list;
    };
    return gradient;
});     