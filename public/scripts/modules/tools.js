define(function() {

    var tools = {

        /***************************************************************************************************
         *** VECTORS UTILS
         ***************************************************************************************************/
        vectors: {
            /***************************************************************************************************
             ***  DESCRIPTION => return the vecotrs sum
             ***  INPUT       => { x : <float>, y : <float> } *2
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            add: function(vA, vB) {
                return {
                    x: vA.x + vB.x,
                    y: vA.y + vB.y
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the substracted vectors
             ***  INPUT       => { x : <float>, y : <float> } *2
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            sub: function(vA, vB) {
                return {
                    x: vA.x - vB.x,
                    y: vA.y - vB.y
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the multiplied vector
             ***  INPUT       => { x : <float>, y : <float> }, <float> m
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            mult: function(vA, m) {
                return {
                    x: vA.x * m,
                    y: vA.y * m
                };
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the vector's magnitude
             ***  INPUT       => { x : <float>, y : <float> }
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            magnitude: function(vA) {
                return Math.sqrt(vA.x * vA.x + vA.y * vA.y);
            },

            /***************************************************************************************************
             ***  DESCRIPTION => return the divided vector
             ***  INPUT       => { x : <float>, y : <float> }, <float> m
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            div: function(vA, m) {
                return {
                    x: vA.x / m,
                    y: vA.y / m
                };
            },


            /***************************************************************************************************
             ***  DESCRIPTION => get the normalized vector
             ***  INPUT       => { x : <float>, y : <float> }
             ***  OUTPUT      => { x : <float>, y : <float> }
             ***************************************************************************************************/
            normalize: function(vA) {
                var m = this.magnitude(vA);
                return this.div(vA, m);
            },

            /***************************************************************************************************
             ***  DESCRIPTION => get the distance between 2 positions
             ***  INPUT       => { x : <float>, y : <float> } x2
             ***  OUTPUT      => float
             ***************************************************************************************************/
            getDistance: function(pos1, pos2) {
                var distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
                return distance;
            },

            /***************************************************************************************************
             ***  DESCRIPTION => get the angle between 2 positions
             ***  INPUT       => { x : <float>, y : <float> } x2, string ("degree" or "radian")
             ***  OUTPUT      => float
             ***************************************************************************************************/
            getAngle: function(pos1, pos2, angleType) {
                var angleRad = Math.atan2(pos1.x - pos2.x, pos1.y - pos2.y) - Math.PI / 2;
                var angleDeg = angleRad * 180 / Math.PI;

                if (angleType === "degree") {
                    return -angleDeg;
                } else {
                    return -angleRad;
                }
            }
        }


    };

    return tools;
});
