module.exports = function(io,socket,PublicServerStockingSpacePrivate,info){
    var xMax = info['xMax'];
    var yMax = info['yMax'];

    function generateBonus(){
        var x1 = xMax * Math.random() - 40;
        var y1 = yMax * Math.random() - 60;
        var id1 = Math.round((Math.random()*100000000));
        var x2 = xMax * Math.random() - 40;
        var y2 = yMax * Math.random() - 60;
        var id2 = (Math.random()*100000000);
        io.sockets.emit("New Bonus fedeGame",{bonus : {x1:x1,y1:y1,id1:id1},malus : {x2:x2,y2:y2,id2:id2}});
    }

    return setInterval(function(){
        generateBonus();
    },6000);
};
