define(['event_bus',
		'modules/window_size',
		'modules/add_domElem',
		'modules/canvas'], 
		function (eventBus,WindowSize,Canvas) {
	eventBus.on("gameover",function()
	{
		function replay()
		{
			location.reload();
		}
		var taille = WindowSize.getWindowSize();
		var cssgameover = "width:"+taille.width+"px;height:"+taille.height+"px;position:absolute;cursor:pointer;z-index:15;background:#000000 url('../images/gameover.png') no-repeat center;";	
		eventBus.emit("createElement", {elem:"div", stylesheet:cssgameover, id:"gameOver", typeEvent:"click", event:replay});
		
	});
});