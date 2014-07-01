define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){
	var soundList = {
        bonusExplode : new Howl({
            urls: ['sounds/effects/bonus/bonusExplode.wav']
        }),
        malusExplode : new Howl({
            urls: ['sounds/effects/malus/malusExplode.wav']
        }),
        missBonus : new Howl({
            urls: ['sounds/effects/malus/missBonus.wav']
        }),
        music : new Howl({
            urls: ['sounds/musics/POL-treasure-match-short.wav'],
            loop : true
        })

	};

	return soundList;
});    	