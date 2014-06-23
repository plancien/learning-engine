define(['event_bus',
         'modules/squareHero',
         'game_types/frogAdventure/config',
         'modules/key_listener',
         'game_types/frogAdventure/initHeroInput',
         'game_types/frogAdventure/soundList'
 ],
 function(eventBus, heroEngine, config, keyListener, initHeroInput, soundList){
    var Hero = function(game){
        game.hero = config.hero;
        game.cameraRender.putSpriteOn(game.hero, "hero", "idleRight");
        game.hero.changeAnimation("idleRight");
        game.collisionEngine.addElement(game.hero, "hero");

        game.hero.frameForWaitingAnimation = 180;

        game.hero.collisionCallback.wall = function(wall){
            var leftIn = game.hero.x + game.hero.width - wall.x;    //on calcule de combien l'element se trouve a l'intertieur pour chaque cote
            var rightIn = wall.x + wall.width - game.hero.x;
            var vecX = (leftIn < rightIn) ? leftIn : rightIn;       //On prend a chaque fois la valeur la plsu faible

            var topIn =  game.hero.y + game.hero.height - wall.y;
            var bottomIn = wall.y + wall.height - game.hero.y;
            var vecY = (topIn < bottomIn) ? topIn : bottomIn;

            if (vecX < vecY){                               //Si on doit expulser en x
                if (leftIn < rightIn )
                    game.hero.x -= vecX; 
                else
                    game.hero.x += vecX;
            }
            else{                                           //Sinon on expulse en y
                if (topIn < bottomIn){
                    game.hero.y -= vecY;
                    game.hero.canJump = true;
                    game.hero.currentJumpFrame = game.hero.nbFrameJump;
                }
                else{
                    game.hero.y += vecY - 1;
                    if (!game.hero.wallGrip && game.hero.speedY <= 0){
                        game.hero.wallGrip = wall;
                        game.hero.noGravity = true;
                        soundList.ceilingGrip.play();
                    }
                }
                game.hero.speedY = 0;
            }
        };

        initHeroInput(game);
        game.hero.run = function(){
            this.speedX *= this.friction;
            this.x += this.speedX;
            if (this.speedX > 0)
                this.speedX = Math.floor(this.speedX * 10)/10;  //Permet d'eviter un float immense jamais a 0
            else
                this.speedX = Math.ceil(this.speedX * 10)/10;  //Permet d'eviter un float immense jamais a 0


            if (this.wallGrip){             //Si le hero est acroche a un plafond
                if (game.collisionEngine.rectCollision(this, this.hitbox[0], this.wallGrip, this.wallGrip.hitbox[0])){
                    this.y = this.wallGrip.y + this.wallGrip.height - 1; //On rajoute un - 1 pour creer une collision sur la prochaine frame
                    this.speedY = 0;
                }
                else{
                    this.wallGrip = false;
                    this.noGravity = false;
                    this.speedY -= 1; //Permet les transition sur deux plafond colle
                }
            }


            if (this.speedX == 0){
                this.currentFrameWaiting++;     //Quand il est a l'arret on attend pour lui faire jouer uen petite animation
                var first = (this.currentFrameWaiting >= this.frameForWaitingAnimation) ? "waiting" : "idle";
                soundList.step.mute();
            }
            else {
                this.currentFrameWaiting = 0;
                var first = "run";
                if (this.speedY == 0)
                    soundList.step.unmute();
            }
            var third = (this.speedY < 0 || this.wallGrip) ? "Reverse" : "";

            var animationName = first + this.sens + third;

            if (this.currentAnim != animationName)
                this.changeAnimation(animationName);
        }

        game.gravityEngine.addElement(game.hero);
        game.cameraRender.add(game.hero);
        game.cameraRender.fixedCameraOn(game.hero);
    };



    return Hero;
});