define([], function() {
	var getImage = function(name, files, getUrl){
		var files = files || "sprites";
		files += '/';

		if (getUrl){
			return "./images/"+files+name;
		}
		else{
			var image = new Image();
			image.src = "./images/"+files+name;
			return image;
		}
	}
	return getImage;
});