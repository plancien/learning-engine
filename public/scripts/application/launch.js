define(["connector"], function(socket){
    "use strict";

    var games = [];

    function createGame(e) {
        e && e.preventDefault && e.preventDefault();
        var selected = $(".modelList").val();
        
        socket.emit("create game",getGameOption());
        socket.on("redirect game",function(gameInfo) {
            window.location.href = "/?info="+gameInfo.name;
        });
        //joinGame(getGameOption());
    }

    function updateGame(game) {
        var options = getGameOption("#gameUpdate");
        options.name = game.name;
        socket.emit("update game",options);
        socket.on("redirect game",function(gameInfo) {
            window.location.href = "/?info="+gameInfo.name;
        });
    }
    
    function joinGame(gameInfo) {
        require(['game', "game_types/"+gameInfo.url], function(game, setGame) {
            $("#mainMenu").hide();
            setGame(gameInfo);
            game.init(gameInfo.question);
        });
    }

    function deleteGame(name) {
        socket.emit()
    }

    function getGameOption(div) {
        var div = div || "#gameCreation";
        return {
            bonus: $(div+" .bonusImg").val(),
            malus: $(div+" .malusImg").val(),
            question: $(div+" .question").val(),
            game: $(div+" .modelList").val()
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
        joinGame: joinGame,
        // gameUpdate: gameUpdate,
        updateGame: updateGame
    }

});
