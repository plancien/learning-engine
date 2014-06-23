define(['ext_libs/howler.min', "modules/muteHowler"], function(howler, mute){
	var soundList = {
        bonusExplode : new Howl({
            urls: ['sounds/learningShooter/bonusExplode.wav']
        }),
        malusExplode : new Howl({
            urls: ['sounds/learningShooter/malusExplode.wav']
        }),
        missBonus : new Howl({
            urls: ['sounds/learningShooter/missBonus.wav']
        }),
        music : new Howl({
            urls: ['sounds/learningShooter/POL-treasure-match-short.wav'],
            loop : true
        })

	};

	return soundList;
});    	