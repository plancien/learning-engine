/*

@name 
    Runner
@endName

@description
    Run, pick up bonuses, and dodge maluses!
@endDescription

*/

define([
    'event_bus',
    'modules/score',
    'modules/bonus_chooser',
    'modules/bonus_fader',
    'modules/frames',
    'modules/move',
    'modules/collision',
    'modules/playerShooter',
    'modules/canvas'
], function (eventBus) {

    return function(params)
    {
        var canvas = Canvas.create();
        var spawnDelay = 0;
        var collectibles = [];
        
        eventBus.emit('init bonus', false, params.bonusUrl);
        eventBus.emit('init bonus', true,  params.malusUrl);

        eventBus.emit('init player', {});

        eventBus.emit('new player', 10, 10, 40, 400, canvas, 1, "pouet");

        function gameloop(){
            spawnDelay -= 1;
            if(spawnDelay <=0){
                spawnCollectible();
                spawnDelay = Math.floor(Math.random()*240+60);
            }
            eventBus.emit("need coordinates");
            /*for(var i = 0, i < collectibles.length, i++){
                collectibles[i].update();

            }*/
        }

        function spawnCollectible(){
            var collectible = new Collectible(Math.floor(Math.random()*200+50), Math.floor(Math.random()*200+50), Math.floor(Math.random()*5+5));
            collectibles.push(collectible);
            eventBus.emit("need new bonus");
        }
            
        var Collectible = function(x, y, speed){
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.good;
            this.url;

            this.update = function(){
                this.y -= this.speed;
            }
        }

        eventBus.on("send coordinates", function(x,y){
            eventBus.emit('DrawThis', x, y,20 ,20,"../../images/flag_french");
        })

        eventBus.on('new frame', function() {
            gameloop()
        })

        eventBus.on("dead", function(){

        });
    }
})