
window.onload=function init(){
    var game = {
        canvas: document.getElementById("canvas"),
        ctx: document.getElementById("canvas").getContext('2d'),
        run:function run(){
            window.requestAnimationFrame(function(){game.run()});
            this.ctx.fillStyle ='white';
            this.ctx.fillRect(0,0,canvas.width,canvas.height)
           
        },
        player:{
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
            // addBlock:function addBlock(){
            //     console.log("lool");
            // },
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











function addEventCapabilities (object) {
    
    var listenersFor = {};  
    object.on = function (eventName, callback) {
       listenersFor[eventName] = listenersFor[eventName] || [];
       listenersFor[eventName].push(callback); 
    };

    object.emit = function () {
        var args = Array.prototype.slice.call(arguments);
        console.log("arguments : ", arguments);
        console.log("args :", args);
        //shift récupère la première valeur du tableau,la return et la supprime args.pop() le dernier argument.
        var eventName = args.shift();
        // si event est associé listeners == event sinon pas d'event donc tableau vide
        var listeners = listenersFor[eventName] || [];
        // on parcourt la liste des function liée a cet event.
        for(var i= 0; i < listeners.length; i++) {
            try {
                //apply appelle la fonction en lui passant en paramêtre le contenu du  tableau args.
                //args est une liste d'arguments que l'on passe à la fonction contenue dans listeners[i]. 
                //Le premiers argument remplace la variable "this" dans la fonction. 

                //maFonction.apply(null,[1,2,3]) <=> maFonction(1,2,3);
                listeners[i].apply(object, args);
            } catch(e) {
                console.log('Error on event ' + eventName);
                // bloque le script et renvoie l'event (e) qui a provoqué l'erreur.
                throw(e);
            }
        }
    };
}
/*var game = {};
addEventCapabilities(game);
game.on('connected', function a (name) {
    // this va etre remplacé par le 1er argument d' apply() en ligne 28
    console.log("Une personne s'est connectée, c'est " + name);
});
game.on('connected', function b () {
    console.log("je suis heureux !" );
});
game.emit('connected', 'arg1', 'arg2');*/