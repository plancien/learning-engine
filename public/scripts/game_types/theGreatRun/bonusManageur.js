define(['event_bus', 'game_types/theGreatRun/config'], function(eventBus, config){

	var BonusManageur = function(){
		this.content = [];
		this.bonusConfig = config.bonus;
		this.frame = config.bonus.nbFramePop-1;
	}
	BonusManageur.prototype.create = function(){
		var newBonus = {};
        newBonus.x = (Math.random()*(canvas.canvas.width-config.bonus.size))|0;
        newBonus.y = (Math.random()*(canvas.canvas.height-config.bonus.size))|0;
        newBonus.width = config.bonus.size;
        newBonus.height = config.bonus.size;

        newBonus.good = (Math.random() <= this.bonusConfig.percentOfBonus) ? true : false;
        newBonus.points = newBonus.good ? this.bonusConfig.malusImageScore : this.bonusConfig.bonusImageScore;
        newBonus.image = newBonus.good ? bonusImage : malusImage;
        newBonus.nbFrameLife = this.bonusConfig.nbFrameLife;

        eventBus.emit("init render", {
            object: newBonus,
            sprite: {
                x: 0,
                y: 0,
                width: newBonus.image.width,
                height: newBonus.image.height,
                img: newBonus.image
            }
        });

        this.content.push(newBonus);
	}
	BonusManageur.prototype.loop = function(player, score){
		this.frame++;
		if (this.frame % this.bonusConfig.nbFramePop == 0)		//permet de faire pop un bonus toutes les X frame
			this.create();

        for (var i = this.content.length - 1; i >= 0; i--) {	//Pour tous les bonus en cours
        	this.content[i].nbFrameLife--;
        	eventBus.emit("render object", this.content[i], ctx);

        	if (player.isInside(this.content[i])){				//Si collision avec le joueur
        		player.score += this.content[i].points;
        		this.content.splice(i,1);
        	}
        	else if (this.content[i].nbFrameLife <= 0)			//Si l'esperence de vie du bonus est atteinte
        		this.content.splice(i, 1);
        };
	}

	return new BonusManageur();
});    	

