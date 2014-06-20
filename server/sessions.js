var sessions = {};

function createSession (params) {
    var name = generateUrl();
    var sessions[name] = params;
}

function generateUrl() {
    return ("abcdefghijklmnopqrstuvwxyz123456789").split("").sort(function() {
        return Math.random()-0.5;
    }).slice(0,10).join("");
}

function deleteSession(name) {
    delete sessions[name];
}

module.exports.createSession = createSession;
module.exports.deleteSession = deleteSession;