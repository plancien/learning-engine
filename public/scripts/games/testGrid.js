/*

@name 
    [TEST] Grid 
@endName

@description
    Testing game for the grid module.
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/frames',
    'modules/grid',
    'modules/mouse'
], function(eventBus, Canvas, frames, grid, mouse) {

    var canvas = Canvas.create();

    var Test = function() {
            this.grid = null;
            this.mouse = null;
        };
    var test = new Test();

    var params = {
        context: canvas.context,
        line: 4,
        column: 4,
        caseWidth: 50,
        caseHeight: 50,
        color: "green",
        hover: "red"
    };

    eventBus.emit("create grid", params, test);

    //recuperation de la souris
    eventBus.on('mouse is created', function(mouse) {
        test.mouse = mouse;
    });

    //game loop
    eventBus.on("new frame", function() {
        canvas.context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        if (test.grid != null) {
            test.grid.render();

            //combo between the mouse and the grid to select a case
            for (var i = 0; i < test.grid.caseTable.length; i++) {
                for (var j = 0; j < test.grid.caseTable[i].length; j++) {
                    if (test.mouse.canvasX >= test.grid.caseTable[i][j].x && test.mouse.canvasX <= (test.grid.caseTable[i][j].x + test.grid.caseTable[i][j].width) && test.mouse.canvasY >= test.grid.caseTable[i][j].y && test.mouse.canvasY <= (test.grid.caseTable[i][j].y + test.grid.caseTable[i][j].height)) {
                        test.grid.caseTable[i][j].select(true);
                    } else test.grid.caseTable[i][j].select(false);
                }
            }
        }
    });
});
