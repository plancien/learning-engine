define(["connector"], function(socket){
    "use strict";

    var games = []

    function createGame(e) {
        e && e.preventDefault && e.preventDefault();
        var selected = $("#modelList").val();
        if (!games[selected]) {
            return false;
        }
        socket.emit("create game",getGameOption());
        socket.on("redirect game",function(gameInfo) {
            window.location.href = "/?info="+gameInfo.name;
        });
        //joinGame(getGameOption());
    }
    
    function joinGame(gameInfo) {
        console.log("yeahaaaaa");
        require(['game', games[gameInfo.game].url], function(game, setGame) {
            $("#mainMenu").hide();
            setGame(gameInfo);
            game.init(gameInfo.question);
        });
    }

    function deleteGame(name) {
        socket.emit()
    }

    function getGameOption() {
        return {
            bonusUrl: $("#bonusImg").val()[0],
            malusUrl: $("#malusImg").val()[0],
            bonus: $("#bonusImg").val(),
            malus: $("#malusImg").val(),
            question: $("#question").val(),
            game: $("#modelList").val()
        };
    }

    function registerGames(infos) {
        for (var i = infos.length - 1; i >= 0; i--) {
            games[infos[i].name] = infos[i]
        };
    }

    return {
        createGame: createGame,
        registerGames: registerGames,
        joinGame: joinGame
    }

});

/*


$("#gameSelect button").click(function(e) {
            $("#mainMenu").hide();

            var gameSelectedName = $("#gameList option:selected").data("fileName");
            var gameSelectedPath = "games/" + gameSelectedName;

            socket.emit('ask css', gameSelectedName);


            require(['game', gameSelectedPath], function(game) {
                game.init();
            });
        });
        */