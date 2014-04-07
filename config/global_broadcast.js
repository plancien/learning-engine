
module.exports = function(io,socket) {

    socket.on("broadcast", function(data) {
        socket.broadcast.emit("broadcast",data);
    });
    socket.on("publish", function(data) {
        io.sockets.emit("broadcast",data);
    });
}