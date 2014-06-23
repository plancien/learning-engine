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
    params.players = [];
    sessions[name] = params;
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
            var session = sessions[gameName]
            session.players.push(socket.name);
            socket.on("disconnect",function() {
                session.players.splice(session.players.indexOf(socket.name),1);
            });
            socket.emit("join game",session);
        };
    });

    socket.on("want session info", function(name) {
        if (sessions[name]) {
            socket.emit("session info", sessions[name]);
        };
    });

    socket.on("want all sessions", function() {
        socket.emit("live sessions", sessions);
    });

    socket.on("delete session", deleteSession);
}

module.exports.createSession = createSession;
module.exports.deleteSession = deleteSession;
module.exports.register = register;