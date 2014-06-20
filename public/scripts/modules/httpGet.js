
define([], function(){
    // utility function for loading assets from server
    function httpGet(theUrl) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    // utility function for loading json data from server
    function httpGetJson(theUrl) {
        var responseText = httpGet(theUrl);
        return JSON.parse(responseText);
    } 

    return {
    	"responseText" : httpGet,
    	"json" : httpGetJson
    };
});    	
