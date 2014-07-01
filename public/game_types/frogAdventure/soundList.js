define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){

    var soundList = {
        malus : new Howl({
            urls: ['sounds/effects/malus/CA_malus.wav']
        }),
        bonus : new Howl({
            urls: ['sounds/effects/bonus/CA_bonus.wav']
        }),

        jump : new Howl({
            urls: ['sounds/effects/jump/CA_jump.wav']
        }),

        ceilingGrip : new Howl({
            urls: ['sounds/effects/other/ceilingGrip.wav']
        }),

        step : new Howl({
            urls: ['sounds/effects/other/step.wav'],
            loop : true
        }),

        music : new Howl({
            urls: ['sounds/musics/POL-toy-ships-short.wav'],
            loop : true
        }),

        pickupFly : new Howl({
            urls: ['sounds/effects/bonus/pickupFly.wav']
        })

    };

    return soundList;
});     