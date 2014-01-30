define(['event_bus','modules/frames'], function(eventBus){
    return function() {

        var particleTable = [];
        var context = "";
        eventBus.on('newCanvas', function(canvas){
            context = canvas.context;
        });
        var Particle = function(x, y, color, duration) {
            this.x = x;
            this.y = y;
            this. heightWidth = 5;
            this.duration = duration;
            this.speed = Math.random() * 5;
            this.angle = Math.random() *Math.PI *2;
            this.color = color;
            
            this.move = function() {
                //mouvements aleatoirs en angle
                this.x += Math.cos(this.angle)* this.speed;
                this.y -= Math.sin(this.angle)* this.speed;
                if(this.duration <= 0)
                {
                    particleTable.splice(particleTable.indexOf(this),1);
                }
            }

            this.draw = function() {
                context.fillStyle = this.color;
                context.fillRect(this.x, this.y,this.heightWidth,this.heightWidth);
            }
            
            this.update = function update()
            {
                this.duration--;
                this.draw();
                this.move();
            }
        }

       eventBus.on("new frame", function(){
            for (var i = 0; i < particleTable.length ; i++)
            {
                if(particleTable[i] != undefined)
                {
                   particleTable[i].update();
                }
            }
        });

        eventBus.on('CreateParticles', function(x, y, color, count, duration){

            for (var i = 0; i < count; i++)
            {
                var star = new Particle(x, y, color, duration);
                particleTable.push(star);
            }  
        });
    }
});