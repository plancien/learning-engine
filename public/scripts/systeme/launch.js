define([], function(e){
    "use strict";

    var games = []

    function createGame(e) {
        e && e.preventDefault && e.preventDefault();

        console.log("hey");
        var selected = $("#modelList").val();
        if (!games[selected]) {
            return false;
        }
        
        require(['game', games[selected].url], function(game, setGame) {
            $("#mainMenu").hide();
            setGame(getGameOption());
            game.init($("#question").val());
        });
    }
    
    function getGameOption() {
        return {
            bonusUrl: $("#bonusImg").val()[0],
            malusUrl: $("#malusImg").val()[0],
            bonus: $("#bonusImg").val(),
            malus: $("#malusImg").val(),
            question: $("#question").val()
        };
    }

    function registerGames(infos) {
        for (var i = infos.length - 1; i >= 0; i--) {
            games[infos[i].name] = infos[i]
        };
    }

    return {
        createGame: createGame,
        registerGames: registerGames
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