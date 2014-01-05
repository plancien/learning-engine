define(['event_bus'], function(eventBus) {
    
    /*******************************************************************************************************
    The render compenent, it allows you to render an animated or unanimated sprite and patterns.
    The render can be rotated if there is a rotation parameter on the object must be in radian in counterclockwise.
    *******************************************************************************************************/

    function addRenderCapabilities (params)
    {
        var object                  =       params.object;
        object.defaultSprite         =       params.sprite;
        if(params.rotating === true && object.rotation !== undefined){
            object.rotateRender = true;
        }
        if(params.patternRepeat === "repeat" || params.patternRepeat === "repeat-x" || params.patternRepeat === "repeat-y"){
            object.patternRepeat = params.patternRepeat;
        }
        
        object.render = function (context)
        {
            if(this.rotateRender){
                if(this.patternRepeat !== undefined){
                    context.save();
                    context.translate(this.x, this.y);
                    context.rotate(this.rotation);
                    context.translate(-this.width/2, -this.height/2);
                    var pattern = context.createPattern(this.defaultSprite.img, this.patternRepeat);
                    context.rect(0, 0, this.width, this.height);
                    context.fillStyle = pattern;
                    context.fill();
                    context.fillStyle = "rgb(0,0,0)";
                    context.restore();
                }
                else if(this.animation !==  undefined){
                    context.save();
                    context.translate(this.x, this.y);
                    context.rotate(this.rotation);
                    context.drawImage(this.defaultSprite.img, this.animation.currentAnim.sprites[this.animation.currentFrame].x, this.animation.currentAnim.sprites[this.animation.currentFrame].y, this.animation.currentAnim.sprites[this.animation.currentFrame].width, this.animation.currentAnim.sprites[this.animation.currentFrame].height, -this.width /2, -this.height/2, this.width, this.height);
                    context.restore();
                }else{
                    context.save();
                    context.translate(this.x, this.y);
                    context.rotate(this.rotation);
                    context.drawImage(this.defaultSprite.img, this.defaultSprite.x, this.defaultSprite.y, this.defaultSprite.width, this.defaultSprite.height, -this.width/2, -this.height/2,this.width,this.height);
                    context.restore();
                }
            }else{
                if(this.patternRepeat !== undefined){
                    context.save();
                    context.translate(this.x - this.width/2, this.y - this.height/2);
                    var pattern = context.createPattern(this.defaultSprite.img, this.patternRepeat);
                    context.fillStyle = pattern;
                    context.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                    context.fillStyle = "rgb(0,0,0)";
                    context.restore();
                }
                else if(this.animation !==  undefined){
                    context.drawImage(this.defaultSprite.img, this.animation.currentAnim.sprites[this.animation.currentFrame].x, this.animation.currentAnim.sprites[this.animation.currentFrame].y, this.animation.currentAnim.sprites[this.animation.currentFrame].width, this.animation.currentAnim.sprites[this.animation.currentFrame].height, this.x - (this.width /2), this.y - (this.height/2), this.width, this.height);
                }else{
                    context.drawImage(this.defaultSprite.img, this.defaultSprite.x, this.defaultSprite.y, this.defaultSprite.width,this.defaultSprite.height, this.x-(this.width/2), this.y-(this.height/2),this.width,this.height);
                }
            }
        }
        object.animate = function ()
        {
            //the f is time frame, to fluidify the animation
            if(this.animation.isOnPause){
                return;
            }
            this.animation.f++;
            if(this.animation.f % 6 === 0)
            {
                if(this.animation.currentFrame >= (this.animation.currentAnim.sprites.length-1)){
                    eventBus.emit("animation end", this, this.animation.currentAnim.name);
                }else{
                    this.animation.currentFrame++;
                }
            }
        }
    }

    function addAnim (object, anim){

        if(object.animation == undefined){
            object.animation = {
                f : 0,
                currentFrame : 0,
                currentAnim : undefined,
                anims : [],
                play : function(animName){
                    this.currentAnim = anims[animName];
                    this.f = 0;
                    this.currentFrame = 0;
                },
                pause : function(){
                    this.isOnPause = true;
                },
                reset : function(){
                    this.currentFrame = 0;
                    this.f = 0;
                }
            }
        }
        object.animation.anims[anim.name] = anim;
        if(object.animation.currentAnim === undefined){
            object.animation.currentAnim = anim;
        }
    }


    /*************************************************************
        All the events related to the render and the animation
    **************************************************************/

    eventBus.on('init render', function (params) {
        if(params.object !== undefined || params.defaultSprite !== undefined){
            addRenderCapabilities(params);
        }
    });  

    eventBus.on('add animation', function (object, anim) {

        if(object !== undefined || anim !== undefined){
            addAnim(object, anim)
        }
    }) 

    eventBus.on('play animation', function (object, animName) {
        if(params.object !== undefined || animName !== undefined){
            object.animation.play(animName)
        }
    })

    eventBus.on('pause animation', function (object) {
        if(params.object !== undefined){
            object.animation.pause(animName)
        }
    })

    eventBus.on('reset animation', function (object) {
        if(object !== undefined){
            object.animation.reset()
        }
    })

    eventBus.on('render object', function (object, context) {
        if(object !== undefined || context !== undefined){
            if(object.render !== undefined){
                object.render(context);
            }
        }
    })

    eventBus.on('animate object', function (object) {
        if(object !== undefined){
            if(object.animate !== undefined){
                object.animate();
            }
        }
    })
});