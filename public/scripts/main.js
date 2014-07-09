
require(["application/query_controller"], 
function(query){
    var socket = io.connect();
    socket.emit("name",window.userName);

    socket.on("autentificated",function() {
        query.applyCurrentPage();
    });
});


