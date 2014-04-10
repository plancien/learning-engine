module.exports = function(io,socket,PublicServerStockingSpacePrivate,info){
	console.log(info)
	var xMax = info['xMax'];
	var yMax = info['yMax'];
	setInterval(function(){
		generateBonus();
	},6000);

	function generateBonus(){
		var x1 = xMax * Math.random() - this.w;
        var y1 = yMax * Math.random() - this.h;
        var x2 = xMax * Math.random() - this.w;
        var y2 = yMax * Math.random() - this.h;
    	io.sockets.emit("New Bonus fedeGame",{x1:x1,y1:y1,x2:x2,y2:y2});
    }
};
