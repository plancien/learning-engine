define(['event_bus'], function(eventBus) {

    /***************************************
   params needed for the grid
   {
        params.line : the number of line (int);
        params.column : the number of column (int);
        params.caseWidth : (int);
        params.caseHeight : (int);
        params.color : the basic color for your case (string);
        params.hover : the color when the case is selected (string);

   }*/
    var Grid = function (params)
    {
        this.caseTable          =           [];
        //creation of the cases
        for(var i = 0; i < params.line; i++)
        {
            this.caseTable[i] = [];
            for(var j = 0; j < params.column; j++)
            {
                this.caseTable[i].push(new Case(j,i,params.caseWidth,params.caseHeight,params.color,params.hover,params.context));
            }
        }
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
   
    var Case = function (x,y,width,height,color,hover,context)
    {
        this.x              =       x * width;
        this.y              =       y * height;
        this.width          =       width;
        this.height         =       height;
        this.color          =       color;
        this.hover          =       hover;
        this.context        =       context;
        this.selected       =       false;
        this.actualColor    =       this.color;
    }
   
    Case.prototype.render = function (event)
    {
        this.context.lineWidth = 2;
        this.context.strokeStyle = this.actualColor;
        this.context.strokeRect(this.x,this.y,this.width,this.height);
        if(this.selected===true)
        {    
            this.context.fillStyle = this.actualColor;
            this.context.fillRect(this.x,this.y,this.width,this.height);
        }

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

    eventBus.on('create grid', function (params, parent) {

        parent.grid = new Grid(params);
    });
});






