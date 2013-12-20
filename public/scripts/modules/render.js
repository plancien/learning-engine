define(['event_bus'], function(eventBus) {
    
    /*******************************************************************************************************
        It deals of horizontal animation :
        the currentFrameY has to be change by the user when he want the animation to change.
    *******************************************************************************************************/
    function addRenderCapabilities (context,object,params)
    {
        object.f                    =       0;
        object.spritesheet          =       new Image();
        object.spritesheet.src      =       params.spritesheet;
        object.nb_of_frame          =       params.nb_of_frame || 0;
        object.currentFrameX        =       params.currentFrameX || 0;
        object.currentFrameY        =       params.currentFrameY || 0;
        object.frameWidth           =       params.frameWidth;
        object.frameHeight          =       params.frameHeight;
        object.width                =       params.width || params.frameWidth;
        object.height               =       params.height || params.frameHeight;
        
        object.render = function ()
        {
            context.drawImage(this.spritesheet,this.currentFrameX,this.currentFrameY,this.frameWidth,this.frameHeight,this.x-(this.width/2),this.y-(this.height/2),this.width,this.height);
        }
        object.animate = function ()
        {
            //the f is time frame, to fluidify the animation
            this.f++;
            if(this.f%6==0)
            {
                this.currentFrameX+=this.frameWidth;
                if(this.currentFrameX>=(this.nb_of_frame*this.frameWidth))
                {
                    this.currentFrameX = 0;
                }
            }
        }
    }
    /*************************************************************
                --------    Exemple of params   --------
    {   x : 100,
        y : 200,
        spritesheet     : '../asset/character.png',
        nb_of_frame     : 4,
        currentFrameX   : 0,
        currentFrameY   : 32,
        frameWidth      : 24,
        frameHeight     : 32,
        width           : 24,
        height          : 32
    }
    *************************************************************/
    eventBus.on('init render', function (context,object,params) {

        addRenderCapabilities(context,object,params);
        eventBus.emit('render', object);
    });   
});