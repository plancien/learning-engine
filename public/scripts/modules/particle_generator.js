define(['event_bus'], function(eventBus){

    var particleTable = [];

    var Particle = function(x, y, color, canvasWidth) {
        this.x = x;
        this.y = y;
        var disapear = 0;
        var fix=5;
        var change=disapear;
        this.speed = 5;
        this.angle = Math.random() *Math.PI *2;
        this.color = color;

        this.move = function() {
            //mouvements aleatoirs en angle
            this.x += Math.cos(this.angle)* this.speed;
            this.y -= Math.sin(this.angle)* this.speed;
            disapear-=0.07;
            change=disapear;
            if(this.x > canvasWidth || this.x < 0)
            {
                particleTable.splice(this, 1);
            }
        }
        this.draw = function() {    
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, 0.1 + change , 0.1 + change);
        }
    }

    function runParticles() {
        for (var i = 0; i < particleTable.length ; i++)
        {
            particleTable[i].move();
            particleTable[i].draw();
        }
    }

    eventBus.on('CreateParticles', function(x, y, color, count, canvasWidth){
        for (var i =0; i < count; i++)
        {
            var star = new Particle(x, y, color, canvasWidth);
            particleTable.push(star);
        }
        eventBus.emit('newParticle', star);
    });
});