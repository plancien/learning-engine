define(['event_bus',
		'modules/gauge',
		'modules/canvas',
		'modules/frames',
		'modules/chrono',
		'modules/add_domElem',
],function(eventBus,Gauge,Canvas,frames){
	var stockSound=[];
	var cappingGui=false;
    var canvas = Canvas.create({width:100,height:20});
	canvas.canvas.style.marginLeft="50%";
	canvas.canvas.style.left="235px";
	canvas.canvas.style.position="absolute";
	console.log(canvas);
    var gauge = new Gauge({
        context : canvas.context,
        size : {
            x : 100,
            y : 20
        },
		position:{
			x:0,
			y:0
		},
        valueMax : 100,
		color : "blue",
        displayMode : "horizontal"
    });

	eventBus.on("gauge sound",function(music)
	{
		gauge.currentValue=gauge.valueMax*music.volume;
	});
	eventBus.on('add sound',function(loop, src, guiNeeded)
	{
		var music = document.createElement("audio");
		music.setAttribute('src', src);
		music.setAttribute('preload', 'true');
		music.setAttribute('loop', loop);
		music.volume=0.5;
		music.play();
		stockSound.push(music);
		console.log(stockSound);
		eventBus.emit("gauge sound",music);
		if(guiNeeded && !cappingGui)
		{
			eventBus.emit('gui sound',music);
			cappingGui=true;	
		}	
	});
	
	eventBus.on('gui sound', function(music)
	{
		var CancutSound=true;
		var cssPlusSound = "width:40px;height:35px;position:absolute;cursor:pointer;left:320px;margin-left:50%;top:55px;z-index:10;background-image:url('../images/+.png');";
		var cssLessSound = "width:40px;height:35px;position:absolute;cursor:pointer;left:210px;margin-left:50%;top:55px;z-index:10;background-image:url('../images/-.png');";
		var cssCutSound = "width:60px;height:60px;position:absolute;cursor:pointer;left:250px;margin-left:50%;top:40px;z-index:10;background-image:url('../images/On.png');";
	
		var clickPlus = function()
		{
			for(var i = 0; i<stockSound.length; i++)
			{
				console.log(stockSound[i].volume);
				if(stockSound[i].volume<1)
				{
					stockSound[i].volume+=0.1;
				}
			}
		}
		var clickLess = function()
		{
			for(var i = 0; i<stockSound.length; i++)
			{
				if(stockSound[i].volume>0)
				{
					stockSound[i].volume-=0.1;
				}
			}
		}
		var clickCut=function()
		{
			for(var i = 0; i<stockSound.length; i++)
			{
				if(CancutSound==true)
				{
					stockSound[i].volume=0;
					cutSound.style.backgroundImage="url('../images/Off.png')";
					if(i+1===stockSound.length)
					{
						console.log("toto");
						CancutSound=false;
					}
				}
				else
				{
					stockSound[i].volume=0.5;	
					cutSound.style.backgroundImage="url('../images/On.png')";
					if(i+1===stockSound.length)
						CancutSound=true;
				}
			}
		}
		var ManageGauge = function()
		{
			eventBus.emit("gauge sound",music);
		}
		eventBus.emit("createElement", {elem:"div", id:"containGui", parent:"body",typeEvent:"click", event:ManageGauge});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssLessSound, id:"lessSound", parent:"containGui", typeEvent:"click", event:clickLess});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssPlusSound, id:"plusSound", parent:"containGui",typeEvent:"click", event:clickPlus});
		eventBus.emit("createElement", {elem:"div", stylesheet:cssCutSound, id:"cutSound", parent:"containGui", typeEvent:"click", event:clickCut});
		
	});
});