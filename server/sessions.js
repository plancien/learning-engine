/*****************************************\
How session work

c> = Client
s> = Server

c> connect to homepage
c> create game - emit "create game" with gameinfo
s> on("create game") create game session
s> emit "redirect game" to the client
c> on("redirect game") redirect to the correct page

c> on the correct game page, emit "connect to game"
s> on("connect to game") emit "join game" with the gameSessionInfo
c> on("join game"), launch the game

\*****************************************/

var sessions = {};

function createSession (params) {
    var name = generateUrl();
    params.name = name;
    sessions[name] = params;
    return name;
}

function generateUrl() {
    return ("abcdefghijklmnopqrstuvwxyz123456789").split("").sort(function() {
        return Math.random()-0.5;
    }).slice(0,10).join("");
}

function deleteSession(name) {
    delete sessions[name];
}

function register(socket,io) {
    socket.on("create game",function(gameInfo) {
        var session = createSession(gameInfo);
        socket.emit("redirect game", gameInfo)
    });

    socket.on("connect to game",function(gameName) {
        if (sessions[gameName]) {
            socket.emit("join game",sessions[gameName]);
        };
    });

    socket.on("want all sessions", function() {
        socket.emit("live sessions", sessions);
    })
}

module.exports.createSession = createSession;
module.exports.deleteSession = deleteSession;
module.exports.register = register;