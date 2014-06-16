define([], function() {
	var getImage = function(name, files){
		var files = files || "sprites";
		files += '/';

		var image = new Image();
		image.src = "./images/"+files+name;

		return image;
	}
	return getImage;
});