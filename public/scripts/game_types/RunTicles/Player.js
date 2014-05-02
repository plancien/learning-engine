define([],function() {
    return function (id,color){
        //proprieté du player
        this.x = 0;
        this.y = 0;
        this.w = 30;
        this.h = 30;
        this.id = id || Math.random()*1000;
        //gestion vitesse
        this.angle = 0;
        this.points = 0;
        this.MAXSPEED = 4;
        this.accel = 0.2;
        this.decel = 0.1;
        this.speed = {x : 0,y : 0};
        this.color = color;
        //divers 
        this.syncPosFromServer = function(x, y){
           this.x = x;
           this.y = y;
        };
        this.render = function(context){
            generateParticles({x : this.x , y : this.y, color : this.color, angle : this.angle})
        };

        this.drawScore = function(context,x,y){
            context.fillStyle = this.color;
            context.fillText(this.color+' : ',x,y);
            context.fillText(this.points,x,y+30);
        };
        this.deceleration = function(){
            if(Math.abs(this.speed.x)>0){
                this.speed.x <0 ? this.speed.x+=this.decel : this.speed.x-=this.decel
                if(Math.abs(this.speed.x)<this.decel){
                    this.speed.x=0;
                }
            }
            if(Math.abs(this.speed.y)>0){
                this.speed.y <0 ? this.speed.y+=this.decel : this.speed.y-=this.decel
                if(Math.abs(this.speed.y)<this.decel){
                    this.speed.y=0;
                }
            }
            this.x += this.speed.x;
            this.y += this.speed.y;
        }
        this.collision = function(canvas,bonus){
            if(this.x<0 || this.x>canvas.width-this.w){
                this.x += -(this.speed.x)*5;
            }
            if(this.y<0 || this.y>canvas.height-this.h){
                this.y += -(this.speed.y)*5;
            }
            for (var key in bonus) {
                if(CheckCollision(this,bonus[key])){
                    connector.emit("infoToSync -g",{id:this.id,eventName:'BonusTake',update:{id:this.id,bonusid:bonus[key].id},send:{id:this.id,bonusid:bonus[key].id}});
                    this.points += bonus[key].point;
                    delete bonus[key];
                }
            };
        }
        this.loop = function(ctx,i,canvas,bonus){
            this.render(ctx);
            this.drawScore(ctx,20+i,30)
            this.deceleration();
            this.collision(canvas,bonus);
        }
    };
});