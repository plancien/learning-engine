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
        game.hero.hitbox[0] = config.heroHitbox;

            

        game.hero.frameForWaitingAnimation = 180;

        game.hero.collisionCallback.wall = function(wall){
            var hero = game.hero;
            var hitbox = hero.hitbox[0];

            var realX = hero.x + hitbox.offsetX;
            var realY = hero.y + hitbox.offsetY;
            // console.log(hitbox);
                
            var leftIn = realX + hitbox.width - wall.x;    //on calcule de combien l'element se trouve a l'intertieur pour chaque cote
            var rightIn = wall.x + wall.width - realX;
            var vecX = (leftIn < rightIn) ? leftIn : rightIn;       //On prend a chaque fois la valeur la plsu faible

            var topIn =  realY + hitbox.height - wall.y;
            var bottomIn = wall.y + wall.height - realY;
            var vecY = (topIn < bottomIn) ? topIn : bottomIn;

            if (vecX < vecY){                               //Si on doit expulser en x
                if (leftIn < rightIn )
                    hero.x -= vecX; 
                else
                    hero.x += vecX;
            }
            else{                                           //Sinon on expulse en y
                if (topIn < bottomIn){
                    hero.y -= vecY;
                    hero.canJump = true;
                    hero.currentJumpFrame = hero.nbFrameJump;
                }
                else{
                    hero.y += vecY - 1;
                    if (!hero.wallGrip && hero.speedY <= 0){
                        hero.wallGrip = wall;
                        hero.noGravity = true;
                        soundList.ceilingGrip.play();
                    }
                }
                hero.speedY = 0;
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
                    this.y = this.wallGrip.y - this.hitbox[0].offsetY + this.wallGrip.height - 0.01; //On rajoute un - 1 pour creer une collision sur la prochaine frame
                    this.speedY = 0;
                }
                else{
                    this.wallGrip = false;
                    this.noGravity = false;
                    this.speedY -= 1; //Permet les transition sur deux plafond colle
                }
            }


            if (this.speedX == 0){
                var first = "idle";
                soundList.step.mute();
            }
            else {
                var first = "run";
                if (this.speedY == 0)
                    soundList.step.unmute();
            }
            var third = (this.speedY < 0 || this.wallGrip) ? "Reverse" : "";

            if (!this.wallGrip && !this.canJump && (this.speedY < 0 || this.speedX == 0)){
                first = "inAir";
                third = "";
            }

            var animationName = first + this.sens + third;

            if (this.currentAnim != animationName && this.currentAnim != "jump"){
                this.changeAnimation(animationName);
            }
        }

        game.gravityEngine.addElement(game.hero);
        game.cameraRender.add(game.hero, 12);
        game.cameraRender.fixedCameraOn(game.hero);
    };



    return Hero;
});