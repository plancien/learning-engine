require(['connector',"systeme/ui","systeme/launch","systeme/query"], function(socket,ui,launch,query) {

    socket.emit("name",window.userName);
    socket.on("autentificated",function() {
        socket.on('images names', ui.createImageChooser);
        socket.on('inject css', ui.injectCSS);
        socket.on('inject template', ui.replaceOptionTemplate);
        socket.on('live sessions', ui.createSessionsButtons);
        socket.on("games info", launch.registerGames);
        $("#gameCreation").on("submit",launch.createGame)
        $("#mainMenu").fadeIn('normal');

        $(function() {
            $("body").keydown(function(e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if(code == 37 || code == 38 || code == 39 || code == 40) {
                    e.preventDefault();
                }
            });
            $("#educatorView").hide();
            if(query["session"]) {
                $("#mainMenu").hide();
                socket.on("games info", function() {
                    socket.emit("connect to game",query["session"]);
                    socket.on("join game", launch.joinGame);
                });
                socket.emit("want games info");
            } else if(query["info"]) {
                $("#mainMenu").hide();
                $("#educatorView").show();
                socket.on("games info", function() {
                    socket.emit("want session info",query["info"]);
                });
                socket.on("session info",ui.showEducatorMenu);
                socket.emit("want games info");
                socket.emit("want images names");
            } else  {
                socket.on("games info", ui.createGameSelection);
                socket.emit("want games info");
                socket.emit("want images names");
                socket.emit("want all sessions");
            }

            

        });

    });

    
});
