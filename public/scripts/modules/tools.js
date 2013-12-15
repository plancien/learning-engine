define([], function() {
    var tools = 
    {
        /***************************************************************************************************
        ***  DESCRIPTION => get the distance between 2 positions
        ***  INPUT       => { x : <float>, y : <float> } x2
        ***  OUTPUT      => float
        ***************************************************************************************************/
        getDistance : function(pos1, pos2)
        {
            var distance = Math.sqrt(Math.pow(pos1.x-pos2.x , 2) + Math.pow(pos1.y-pos2.y , 2));
            return distance;
        },

        /***************************************************************************************************
        ***  DESCRIPTION => get the angle between 2 positions
        ***  INPUT       => { x : <float>, y : <float> } x2, string ("degree" or "radian")
        ***  OUTPUT      => float
        ***************************************************************************************************/
        getAngle : function(pos1, pos2, angleType)
        {
            var angleRad = Math.atan2(pos1.x - pos2.x, pos1.y - pos2.y)-Math.PI/2;
            var angleDeg = angleRad*180/Math.PI;
            
            if (angleType === "degree") {
                return -angleDeg;
            } else {
                return -angleRad;
            }
        },
    }

    return tools;
});