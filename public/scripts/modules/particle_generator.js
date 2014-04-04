define(['event_bus', 'modules/frames'], function(eventBus) {

    return function() {

        var particleTable = [];
        var context = "";
        eventBus.on('newCanvas', function(canvas) {
            context = canvas.context;
        });

        function Particle(params) {
            this.x = params.x || 0 ;
            this.y = params.y || 0;
            this.size = (params.size || 5)*Math.random() ;
            this.styleParticles = params.style || true;
            this.lifeTime = (params.lifeTime || 100)*Math.random();
            this.speed = (params.speed || 5)*Math.random()+1;
            this.angle = (params.angle|| Math.PI * 2)* Math.random();
            this.color = params.color;

            this.move = function() {
                //mouvements aleatoirs en angle
                this.x += Math.cos(this.angle) * this.speed;
                this.y -= Math.sin(this.angle) * this.speed;
                if (this.lifeTime <= 0) {
                    particleTable.splice(particleTable.indexOf(this), 1);
                }
            };

            this.draw = function() {
                if(this.styleParticles){
                    context.fillStyle = this.color;
                    context.fillRect(this.x, this.y, this.size, this.size);
                }
                else{
                    context.beginPath();
                    context.arc(this.x, this.y,10,this.size,2*Math.PI);
                    context.stroke();
                    context.fill();
                }
            };

            this.update = function update() {
                this.lifeTime--;
                this.draw();
                this.move();
            };
        }

        eventBus.on("new frame", function() {
            for (var i = 0; i < particleTable.length; i++) {
                if (particleTable[i] != undefined) {
                    particleTable[i].update();
                }
            }
        });

        eventBus.on('CreateParticles', function(params) {
        for (var i = 0; i < params.count; i++) {
                var star = new Particle(params);
                particleTable.push(star);
            }
        });
    };

});
