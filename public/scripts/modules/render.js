define(['event_bus'], function(eventBus) {
    
    /*******************************************************************************************************
        It deals of horizontal animation :
        the currentFrameY has to be change by the user when he want the animation to change.
        For exemple on a mouvement, the y will be top, left, right or bottom, the x made the things move.
    *******************************************************************************************************/
    function addRenderCapabilities (context,object,x,y,spritesheet,nb_of_frame,currentFrameX,currentFrameY,frameWidth,frameHeight,width,height)
    {
        object.f = 0;
        object.x = x;
        object.y = y;
        object.spritesheet = spritesheet;
        object.nb_of_frame = nb_of_frame;
        object.currentFrameX = currentFrameX;
        object.currentFrameY = currentFrameY;
        object.frameWidth = frameWidth;
        object.frameHeight = frameHeight;
        object.width = width;
        object.height = height;
        
        object.render = function ()
        {
            context.clearRect(this.x,this.y,this.width,this.height);
            context.drawImage(this.spritesheet,this.currentFrameX,this.currentFrameY,this.frameWidth,this.frameHeight,this.x,this.y,this.width,this.height);
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
        currentFrameY   : 2,
        frameWidth      : 24,
        frameHeight     : 32,
        width           : 24,
        height          : 32
    }
    *************************************************************/
    eventBus.on('init render', function (context,object,params) {
        var object = object;
        //position of the sprite in the canvas
        var x = params.x || 0;
        var y = params.y || 0;
        //image file
        var spritesheet = params.spritesheet;   //required
        //total number of horizontal frames
        var nb_of_frame = params.nb_of_frame || 0;
        //the frame where the animation begin
        var currentFrameX = params.currentFrameX || 0;
        var currentFrameY = params.currentFrameY || 0;
        //the size of the animation frame on the spritesheet
        var frameWidth = params.frameWidth; //required
        var frameHeight = params.frameHeight;   //required
        //the size of the final image on the canvas
        var width = params.widht || frameWidth;
        var height = params.height || frameHeight;

        var image = new Image();
        image.src = spritesheet;

        addRenderCapabilities(context,object,x,y,image,nb_of_frame,currentFrameX,currentFrameY,frameWidth,frameHeight,width,height);
        eventBus.emit('render', object);
    });   
});