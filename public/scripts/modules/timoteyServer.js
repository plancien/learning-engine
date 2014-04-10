module.exports = function(io,socket,PublicServerStockingSpacePrivate){
    if(!PublicServerStockingSpacePrivate["powerUp"]){
    	PublicServerStockingSpacePrivate["powerUp"] = {};
    }
    if(!PublicServerStockingSpacePrivate["users"]){
    	PublicServerStockingSpacePrivate["users"] = {};
    }
    if(!PublicServerStockingSpacePrivate["bullets"]){
    	PublicServerStockingSpacePrivate["bullets"] = {};
    }
	setInterval(function(){
    var powerup = {
        type:((Math.random()*3)|0)+1,
        x:Math.random()*700,
        y:Math.random()*500,
        w: 30,
        h: 30,
        id:(Math.random()*100000000)|0
    };
    switch(powerup.type){
        case 1:
        powerup.modification = {health: 30};
        powerup.color = "green";
        break;
        case 2:
        powerup.modification = {bulletDamage: 10};
        powerup.color = "rouge";
        break;
        case 3:
        powerup.modification = {h:20,w:20,bulletDamage:20};
        powerup.color = "orange";
        break;
        default:
        powerup.modification = {speed: 5};
        powerup.color = "white";
        break;
    }
    io.sockets.emit("new powerup",powerup);
    PublicServerStockingSpacePrivate["powerUp"][powerup.id] = powerup;
    console.log("NEW POWERUP ID° "+powerup.id);
},25*1000);
};
