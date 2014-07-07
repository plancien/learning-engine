define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){
    var soundList = {
        link : new Howl({
            urls: ['/sounds/effects/other/catch.wav']
        }),
        miss : new Howl({
            urls: ['/sounds/effects/malus/miss.wav']
        }),
        crashDown : new Howl({
            urls: ['/sounds/effects/crash_explode/crashDown.wav']
        }),
        music : new Howl({
            urls: ['/sounds/musics/POL-blue-bros-short.wav'],
            loop : true
        })
    }

    return soundList;
});    	