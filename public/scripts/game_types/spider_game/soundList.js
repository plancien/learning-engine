define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){
    var soundList = {
        link : new Howl({
            urls: ['sounds/spiderGame/catch.wav']
        }),
        miss : new Howl({
            urls: ['sounds/spiderGame/miss.wav']
        }),
        crashDown : new Howl({
            urls: ['sounds/spiderGame/crashDown.wav']
        }),
        music : new Howl({
            urls: ['sounds/spiderGame/POL-blue-bros-short.wav'],
            loop : true
        })
    }

    return soundList;
});    	