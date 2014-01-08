define(['event_bus'], function(eventBus) {

    /*
   params 
   {
        params.line;
        params.column;
        params.caseWidth;
        params.caseHeight;
        params.color;
        params.hover;

   }*/
    var Grid = function (params)
    {
        this.caseTable = [];
        for(var i = 0; i < params.line; i++)
        {
            for(var j = 0; j < params.column; j++)
            {
                this.caseTable[i][j] = new Case(j,i,params.caseWidth,params.caseHeight,params.color,params.hover);
            }
        }
    }
   
    Grid.prototype.update = function (event)
    {
        
    }
   
    Grid.prototype.render = function (event)
    {
        for(var i = 0; i < this.caseTable.length; i++)
        {
            for(var j = 0; j < this.caseTable[i].length; j++)
            {
                this.caseTable[i][j].render();
            }
        }
    }
   
    var Case = function (x,y,width,height,color,hover)
    {
        this.x = x * width;
        this.y = y * height;
        this.width = width;
        this.height = height;
        this.color = color;
        this.hover = hover;
        this.selected = false;
        this.actualColor = this.color;
    }
   
    Case.prototype.render = function (event)
    {
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y,this.width,this.height);
    }
   
    Case.prototype.select = function(isSelected)
    {
        this.selected = isSelected;
        if(!this.selected)
        {
            this.actualColor = this.color;
        }
        else 
        {
            this.actualColor = this.hover;
        }
    }

    eventBus.on('init', function (params) {
        var grid = new Grid(params);

        eventBus.emit('grid is created', grid);
    });
});






