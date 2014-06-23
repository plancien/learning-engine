define([],function() {
    return function (x,y,image,id,value){
        this.id = id
        this.w = 40;
        this.h = 60;
        this.x = x;
        this.y = y;
        this.lifeTime = 200;
        this.image = image;

        if(value){
            this.point = 100;
        }
        else{
            this.point = -25;
        }

        this.render = function(context){
            context.drawImage(this.image,this.x,this.y,this.w,this.h);
        };
    }
});
