define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){

    var soundList = {
        malus : new Howl({
            urls: ['sounds/frogAdventure/malus.wav']
        }),
        bonus : new Howl({
            urls: ['sounds/frogAdventure/bonus.wav']
        }),

        jump : new Howl({
            urls: ['sounds/frogAdventure/jump.wav']
        }),

        ceilingGrip : new Howl({
            urls: ['sounds/frogAdventure/ceilingGrip.wav']
        }),

        step : new Howl({
            urls: ['sounds/frogAdventure/step.wav'],
            loop : true
        }),

        music : new Howl({
            urls: ['sounds/frogAdventure/POL-toy-ships-short.wav'],
            loop : true
        }),

        pickupFly : new Howl({
            urls: ['sounds/frogAdventure/pickupFly.wav']
        })

    };

    return soundList;
});     