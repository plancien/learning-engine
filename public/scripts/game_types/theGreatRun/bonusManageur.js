define(['event_bus', 'game_types/theGreatRun/config', 'modules/particle_generator', 'game_types/theGreatRun/gridOccuped','ext_libs/howler.min'], 
function(eventBus, config, particleGenerator, grid){
    var malusSound = new Howl({
        urls: ['sounds/TGR_malus.wav']
    });

    var bonusSound = new Howl({
        urls: ['sounds/TGR_bonus.wav']
    });

    particleGenerator();
	var BonusManageur = function(){
		this.content = [];
		this.bonusConfig = config.bonus;
		this.frame = config.bonus.nbFramePop-1;
	}
	BonusManageur.prototype.create = function(){
		var newBonus = {};
        
        for (var i = 10 ; i > 0 ; i--){   
            newBonus.x = Math.floor(Math.random()*config.nbTilesColumn) * config.tilesSize+config.tilesSize/2;
            newBonus.y = Math.floor(Math.random()*config.nbTilesLine) * config.tilesSize+config.tilesSize/2;
            if (grid.checkTilesFree(newBonus.x, newBonus.y))    //Si la case est libre on passe a la suite
                break;
        }
        grid.trap(newBonus.x, newBonus.y);
        newBonus.width = 0;     //Les bonus vont grossir a leur apparition, ils commencent donc avec une taille nul
        newBonus.height = 0;

        newBonus.good = (Math.random() <= this.bonusConfig.percentOfBonus) ? true : false;
        newBonus.points = (newBonus.good) ? this.bonusConfig.bonusImageScore : this.bonusConfig.malusImageScore;
        newBonus.image = (newBonus.good) ? bonusImage[(Math.random()*bonusImage.length)|0] : malusImage[(Math.random()*malusImage.length)|0];
        newBonus.nbFrameLife = this.bonusConfig.nbFrameLife;
        newBonus.particleColor = (newBonus.good) ? config.bonus.bonusParticleColor : config.bonus.malusParticleColor;

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
        	this.growBonus(this.content[i]);
        	eventBus.emit("render object", this.content[i], ctx);

        	if (player.isInside(this.content[i])){				//Si collision avec le joueur
                if (this.content[i].good)
                    bonusSound.play();
                else
                    malusSound.play();
                config.particle.x = this.content[i].x;
                config.particle.y = this.content[i].y;
                config.particle.color = this.content[i].particleColor;
                eventBus.emit('CreateParticles', config.particle);
        		player.score += this.content[i].points;
                grid.freedom(this.content[i].x, this.content[i].y);
        		this.content.splice(i,1);
        	}
        	else if (this.content[i].nbFrameLife <= 0){			//Si l'esperence de vie du bonus est atteinte
                grid.freedom(this.content[i].x, this.content[i].y);
        		this.content.splice(i, 1);
            }
        };
	}
	BonusManageur.prototype.growBonus = function(bonus){
		var side = 	(bonus.nbFrameLife - -config.bonus.nbFrameGrow > config.bonus.nbFrameLife) ? 1 : //Si il vient d'apparaitre
					(bonus.nbFrameLife < config.bonus.nbFrameGrow) ? -1 : 							//Si il est sur le point de disparaitre
					0;
		if (side){
			bonus.width += config.bonus.pxGrowPerFrame * side;
			bonus.height += config.bonus.pxGrowPerFrame * side;
		}
	}
    BonusManageur.prototype.restart = function(){
        this.content = [];
        this.frame = 0;
    }

	return new BonusManageur();
});    	

