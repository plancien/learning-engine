module.exports = function(io,socket,PublicServerStockingSpacePrivate,info){
	var canvas = info['canvas'];
	setInterval(function(){
		generateBonus();
	},6000);

	function generateBonus(){
		var x = canvas.width * Math.random() - this.w;
        var y = canvas.height * Math.random() - this.h;
    	io.sockets.emit("New Bonus fedeGame",{x,y});
    }
};
