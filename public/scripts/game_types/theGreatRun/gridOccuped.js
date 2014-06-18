define(['game_types/theGreatRun/config'], function(config){
    var Grid = function(){
        this.content = [];

        for (var i = 0; i <= config.nbTilesColumn; i++) {
            this.content.push([]);
            for (var j = 0; j <= config.nbTilesLine; j++) {
                this.content[i][j] = false;
            };
        };
    }
    Grid.prototype.checkTilesFree = function(x, y){
        var pos = this.pxToIndex(x, y);
        if (this.content[pos.x][pos.y]){
            return false;
        } 
        else{
            return true;
        }
    }
    Grid.prototype.trap = function(x, y){
        var pos = this.pxToIndex(x, y);
        this.content[pos.x][pos.y] = true;
    } 
    Grid.prototype.freedom = function(x, y){
        var pos = this.pxToIndex(x, y);
        this.content[pos.x][pos.y] = false;
    }

    Grid.prototype.pxToIndex = function(x, y){
        var realX = (x/config.tilesSize)|0;
        var realY = (y/config.tilesSize)|0;

        return {"x" : realX, "y" : realY};
    }
    window.grid = new Grid();
    return grid;
});
