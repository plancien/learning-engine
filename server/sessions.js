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
var fs = require('fs');
var mime = require("mime");
var user = require(__dirname+"/../server/users.js");

var acceptedType = ["application/json"];

function loadAllSessionGame() {
    var gameFolder = __dirname+"/../bdd/session_game/";
    fs.readdir(gameFolder, function(err, files){
        if (err) {
            throw err;
        }
        for (var i = files.length - 1 ; i >= 0 ; i--){
            if (acceptedType.indexOf(mime.lookup(files[i])) >= 0){
                fs.readFile(gameFolder+files[i], function (err, data) {
                    if (err) throw err;
                    var params = JSON.parse(data);
                    launchSession(params);
                });
            }
        }
    });
}

function createSession (params, userName) {
    var name = generateUrl();
    params.name = name;

    user.addSessionGame(userName, name);
    launchSession(params);

    saveSessionToFile(sessions[name])
    return name;
}

function saveSessionToFile(session) {
    var gameFile = JSON.stringify(session);
    var pathGameSession = __dirname+"/../bdd/session_game/"+session.name+".json"
    fs.writeFile(pathGameSession,gameFile, function(){});
    return name;
}

function launchSession(params){
    var name = params.name;
    params.players = [];
    sessions[name] = params;
}

function generateUrl() {
    return ("abcdefghijklmnopqrstuvwxyz123456789").split("").sort(function() {
        return Math.random()-0.5;
    }).slice(0,10).join("");
}

function deleteSession(name) {
    delete sessions[name];
    var pathGameSession = __dirname+"/../bdd/session_game/"+name+".json"
    fs.unlink(pathGameSession,function(err) {});
}

function register(socket,io) {
    socket.on("create game",function(gameInfo) {
        createSession(gameInfo, socket.name);
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
        user.getSessionGame(socket.name, function(tabSessionName){
            console.log("le tableau des nom de sessions : " + tabSessionName);
                
            var refWantedSession = {};
            for (var i = tabSessionName.length - 1 ; i >= 0 ; i--){
                refWantedSession[tabSessionName[i]] = sessions[tabSessionName[i]];
            }
            socket.emit("live sessions", refWantedSession);
        });
    });

    socket.on("delete session", deleteSession);
}

module.exports.createSession = createSession;
module.exports.deleteSession = deleteSession;
module.exports.register = register;
module.exports.loadAllSessionGame = loadAllSessionGame;
