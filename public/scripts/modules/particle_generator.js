define(['event_bus','modules/frames'], function(eventBus){

    var particleTable = [];
    var context = null;
    eventBus.on('newCanvas', function(canvas){
        context = canvas.context;
    });

    var Particle = function(x, y, color, duration) {
        this.x = x;
        this.y = y;
        var heightWidth = 5;
        var fix=5;
        var change;
        this.duration = duration;
        this.speed = 4;
        this.angle = Math.random() *Math.PI *2;
        this.color = color;
        this.move = function() {
            //mouvements aleatoirs en angle
            this.x += Math.cos(this.angle)* this.speed;
            this.y -= Math.sin(this.angle)* this.speed;
            if(this.duration <= 0)
            {
                particleTable.splice(this, 1);
            }
        }
        this.draw = function() {    
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, heightWidth, heightWidth );
        }
    }

    eventBus.on('new frame', function(){
        if(particleTable[0] != undefined)
        {
            context.clearRect(0,0,1200,1200);
        }
        for (var i = 0; i < particleTable.length ; i++)
        {
            particleTable[i].move();
            particleTable[i].draw();
            particleTable[i].duration--;

        }
    });

    eventBus.on('CreateParticles', function(x, y, color, count, duration){
        for (var i = 0; i < count; i++)
        {
            var star = new Particle(x, y, color, duration);
            particleTable.push(star);
        }
    });
});