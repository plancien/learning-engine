require(['connector',"systeme/ui","systeme/launch","systeme/query"], function(socket,ui,launch,query) {

    socket.on('images names', ui.createImageChooser);
    socket.on('inject css', ui.injectCSS);
    socket.on('inject template', ui.replaceOptionTemplate);
    socket.on('live sessions', ui.createSessionsButtons);
    socket.on("games info", launch.registerGames);
    $("#gameCreation").on("submit",launch.createGame)


        if(localStorage.length > 0){
            $("#socialBar").css('display', 'none');
            $("#mainMenu").fadeIn('normal');
            $("#blocUser").html("Welcome my friend, "+localStorage.cookie+"");
            $('</br><button id="logout" class="button">Deconnexion</button>').appendTo("#blocUser");
            $("#logout").click(function(e) {
                localStorage.clear();
                $("#mainMenu").css('display', 'none');
                $("#socialBar").fadeIn('normal');
            });
        }
        else{
            /* User name verification */
            $("#user button").click(function(e) {
                var myRegex = /\W/; // Match every non character
                var userName = $("#userName").val();

                if (userName.match(myRegex) === null) {
                    localStorage.setItem("cookie",userName);
                    localStorage.setItem("userName",userName);
                    //localStorage.userName = userName;
                    
                    $(this).parent().css('display', 'none');
                    $("#mainMenu").fadeIn('normal');
                    $("#blocUser").html("Welcome my friend, "+userName+"");
                    $('</br><button id="logout" class="button">Deconnexion</button>').appendTo("#blocUser");
                    $("#logout").click(function(e) {
                        localStorage.clear();
                        $("#mainMenu").css('display', 'none');
                        $("#socialBar").fadeIn('normal');
                    });
    
                } else {
                    $("#userAlert").html("Ce champ n'accepte pas de chiffre et de lettre sans espace!");
                }
            });
        }

    $(function() {
        $("body").keydown(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code == 37 || code == 38 || code == 39 || code == 40) {
                e.preventDefault();
            }
        });

        if(query["session"]) {
            socket.on("games info", function() {
                console.log("yeah");
                socket.emit("connect to game",query["session"]);
                socket.on("join game", launch.joinGame);
            });
            socket.emit("want games info");
        } else {
            socket.on("games info", ui.createGameSelection);
            socket.emit("want games info");
            socket.emit("want images names");
            socket.emit("want all sessions");
        }

        

    });

});
