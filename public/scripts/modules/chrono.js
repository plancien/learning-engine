define(['event_bus'], function (eventBus) {

    var stopWatchStart = false;
    var timeStamp = null;
    var giveTime = 
    {
        fullTime : 0,
        hours : 0,
        minutes : 0,
        seconds : 0
    };

    eventBus.on('start stopwatch', function()
    {
        timeStamp = new Date().getTime();
        stopWatchStart = true;
    });

    eventBus.on('stop stopwatch', function()
    {
        timeStamp = null;
        stopWatchStart = false;
    });

    eventBus.on('new frame', function()
    {
        if(stopWatchStart)
        {
            var compareStamp = new Date().getTime();
            giveTime.seconds = Math.round((compareStamp - timeStamp) / 1000);

            if(giveTime.seconds > 60){
                giveTime.minutes++;
                timeStamp = new Date().getTime();
            }

            if(giveTime.minutes > 60){
                giveTime.hours++;
                giveTime.minutes = 0;
            }

            giveTime.fullTime = giveTime.hours + " : " + giveTime.minutes + " : " + giveTime.seconds;
            eventBus.emit('get stopwatch', giveTime);
        }
    });

});


