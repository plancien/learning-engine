define([
    'event_bus',
    'event_capabilities'
], function(eventBus, addEventCapabilities) {
        var game = {};
        game.canvas: document.getElementById("canvas"),
        game.ctx: document.getElementById("canvas").getContext('2d'),
        game.run = function run(){
            window.requestAnimationFrame(function(){game.run()});
            this.ctx.fillStyle ='white';
            this.ctx.fillRect(0,0,canvas.width,canvas.height)
           
        },
        game.player:{
            x:0,
            y:0,
            w:64,
            h:64,
            color:'red',
            move:function move(args){
                
                switch(args){
                    case 'up':
                    this.y--;
                    break;
                    case 'down':
                    this.y++;
                    break;
                    case 'gauche':
                    this.x-=40;
                    break;
                    case 'droite':
                    this.x++;
                    break;
                } 
            },
            addBlock:function addBlock(){
                console.log("lool");
            },
        }

    };
    addEventCapabilities(game.player);
    game.player.on('move',function(e){
        console.log("loooool",this)
        this.move(e);
    });
    addEventCapabilities(game);
    game.on('finishLoad',game.run);
    window.onkeydown = function(e){

        switch(e.keyCode){
            case 38 : 
            game.player.emit('move',"up");
            break;
            case 40 : 
            game.player.emit('move',"down");
            break;
            case 39 :
            game.player.emit('move','droite');
            break;
            case 37 : 
            game.player.emit('move',"gauche");
            break;
        }
    };
    game.emit('finishLoad');
    requestAnimationFrame(run(game));
}

    function run(game){
         game.ctx.fillStyle = this.player.color;
        game.ctx.fillRect(this.player.x,this.player.y,this.player.w,this.player.h);
    }
});
