define([], function(){

	function getQueryStr(){
	    return (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
	    })(window.location.search.substr(1).split('&'));
	}
	function getPageName(){
		return window.location.pathname.split("/")[1];
	}

	function applyCurrentPage(){
		var page = getPageName();

		if (page === "create_game"){
			
		}
	}

	return {
		"applyCurrentPage" : applyCurrentPage
	}
});