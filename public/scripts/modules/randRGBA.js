define(['event_bus'], function (eventBus) {

    eventBus.on('randRGBA', function () 
    {
        //l'on peut customisé sont random RGBA, si l'on met false, un random sera effectué, si l'on met un chiffre, il sera utilisé
        function randRGBA (red,green,blue,alpha)
        {
            if (red === false || red === undefined)
                r = (Math.random()*255);
            else
                r = red;

            if (green === false || green === undefined)
                g = (Math.random()*255);
            else
                g = green;

            if (blue === false || blue === undefined)
                b = (Math.random()*255);
            else
                b = blue;

            if (alpha === false || alpha === undefined)
                a = Math.random();
            else
                a = alpha;

            rgba="rgba("+r+","+g+","+b+","+a+")";

            return rgba;
        }
    }
});