
require(['connector'], function (socket) {
    
    $(function() {
        socket.emit("ask gameNames");

        socket.on("send gameNames", function(data) {

            for (var i in data)
            {
                var gameName = data[i].substr(0, data[i].length-3);
                var elem = $(document.createElement('div'));
                elem.attr("id", gameName);
                elem.html(gameName.replace(/_/g, " "));
                $("#gameList").append(elem);
            }

            $("#gameList div").click(function(e) {
                $("#gameSelection").hide();

                var gameSelectedName = e.currentTarget.id;
                var gameSelectedPath = "games/" + gameSelectedName;

                socket.emit('ask css', gameSelectedName);
                socket.on('inject css', function(data) {
                    $("head").append("<link rel='stylesheet' type='text/css' href='" + data + "'>");
                });

                require(['game', gameSelectedPath], function (game) {
                    game.init();            
                });
            });
        });
    });

});