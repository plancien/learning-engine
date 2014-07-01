require(['connector',"application/dom_manipulator","application/launch","application/query"], function(socket,ui,launch,query) {

    socket.emit("name",window.userName);

    socket.on("autentificated",function() {
        socket.on('images names', ui.createImageChooser);
        socket.on('inject template', ui.replaceOptionTemplate);
        socket.on('live sessions', ui.createSessionsButtons);
        socket.on("games info", launch.registerGames);
        
        $("#mainMenu").fadeIn('normal');

        $(function() {
            $("#educatorView").hide();

            if(query["session"]) {
                $("#mainMenu").hide();

                // socket.on("games info", function(game) {
                //     socket.emit("connect to game",query["session"]);
                //     socket.on("join game", launch.joinGame);
                // });
                // socket.emit("want games info");

                socket.emit("want session info", query['session']);

                socket.on("session info", function(game){
                    launch.joinGame(game);
                });
            }
            else if(query["info"]) {

                $("#mainMenu").hide();
                $("#educatorView").show();
                socket.on("games info", function() {
                    socket.emit("want session info",query["info"]);
                });
                socket.on("session info", ui.showEducatorMenu);
                socket.on("session info", function(game) {
                    $("#gameUpdate").on("submit",function(e) {
                        e && e.preventDefault && e.preventDefault();
                        launch.updateGame(game)
                    });
                })
                socket.emit("want games info");
                socket.emit("want images names");

            } 

            else  { //S'execute au premier chargement de la page
                $("#gameCreation").on("submit",launch.createGame);
                socket.on("games info", ui.createGameSelection);
                socket.emit("want games info");
                socket.emit("want images names");
                socket.emit("want all sessions");
            }

            

        });

    });

    
});
