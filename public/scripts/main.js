require(['connector'], function (socket) {
    
    $(function() {
        socket.emit("ask gamesInfos");

        socket.on("send gamesInfos", function(infos) {
            for (var i = 0; i < infos.gameNames.length; i++)
            {
                var $elem = $(document.createElement('option'));
                $elem.attr("id", infos.gameNames[i]);
                $elem.html(infos.gameNames[i]);
                $elem.data("description", infos.descriptions[i]);
                $elem.data("fileName", infos.fileNames[i]);
                $("#gameList").append($elem);

            }

            $("#gameDescription").html(infos.descriptions[0]);

            $("#gameList").change(function(e) {
                var description = $("#gameList option:selected").data("description");
                $("#gameDescription").html(description);
            });

            $("#gameSelect button").click(function(e) {
                $("#mainMenu").hide();

                var gameSelectedName = $("#gameList option:selected").data("fileName");
                console.log(gameSelectedName);
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