
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

                var gameSelected = "games/" + e.currentTarget.id;

                require(['game', gameSelected], function (game) {
                    game.init();            
                });
            });
        });
    });

});