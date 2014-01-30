// WIP hope to link those modules with a ranking test on the allUsers made in server.js at line 64 
define(['event_bus', 'modules/score', 'modules/gameover', 'modules/win'], function(eventBus, allUsers) {
    var i;
    var ranking = [];

    eventBus.on('addRank');

    function doRanking ()
    {
        for (i = 0; i < Things.length; i++) {
            Things[i]
        };
    }
});