module.exports = function(io,socket,PublicServerStockingSpacePrivate,info){
	var xMax = info['xMax'];
	var yMax = info['yMax'];
			console.log(xMax)
	setInterval(function(){
		generateBonus();
	},6000);

	function generateBonus(){
		var x1 = xMax * Math.random() - 40;
        var y1 = yMax * Math.random() - 60;
        var x2 = xMax * Math.random() - 40;
        var y2 = yMax * Math.random() - 60;
    	io.sockets.emit("New Bonus fedeGame",{x1:x1,y1:y1,x2:x2,y2:y2});
    }
};
