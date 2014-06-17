define(['event_bus'], function(eventBus){
    var isInside = function inInside (objectB){
        if(this.x < objectB.x){
            if(this.x + this.width/2 > objectB.x - objectB.width/2){
                if(this.y < objectB.y){
                    if(this.y + this.height/2 > objectB.y - objectB.height/2){
                        return true;
                    }
                }else if(this.y - this.width/2 < objectB.y + objectB.width/2){
                    return true;
                }
            }
        }else if(this.x - this.width/2 < objectB.x + objectB.width/2){
            if(this.y < objectB.y){
                if(this.y + this.height/2 > objectB.y - objectB.height/2){
                        return true;
                    }
            }else if(this.y - this.width/2 < objectB.y + objectB.width/2){
                return true;
            }
        }
        return false;
    }
    return isInside;
});    	