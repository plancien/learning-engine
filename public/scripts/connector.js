define(function() {

    var socket = io.connect();

    socket.broadcast = function() {
        var data = {};
        data.args = Array.prototype.slice.call(arguments);
        data.name = data.args.shift();
        socket.emit("broadcast",data);
    };

    socket.publish = function() {
        var data = {};
        data.args = Array.prototype.slice.call(arguments);
        data.name = data.args.shift();
        socket.emit("publish",data);
    };

    socket.on("broadcast",function (data) {
        console.log("hey");
        data.args.splice(0,0,data.name);
        socket.$emit.apply(socket,data.args);
    });

    return socket;
});
