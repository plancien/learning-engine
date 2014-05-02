define(['event_bus'], function(eventBus){

    var timerCD;
    var lastUp;
    var isworking = false;


    eventBus.on('start countdown', function(timer) {
        timerCD = (new Date().getTime()/1000)+timer;
        isworking = true;
    });

    eventBus.on('new frame', function() {
        if (isworking) {
          var actualCD = Math.floor(timerCD - (new Date().getTime()/1000));
          if(actualCD<=0){
              eventBus.emit('countdown finish',timerCD)
              isworking = false;
            }
            else{
              eventBus.emit('time remaning',actualCD)
            }

        }
    });

});
