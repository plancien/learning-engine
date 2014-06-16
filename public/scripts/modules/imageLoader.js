define([], function() {
	var getImage = function(name, files){
		console.log(name);
		if (typeof(name) == "object"){
			console.log(name);
			return false;
		}
		var files = files || "sprites";
		files += '/';

		var image = new Image();
		image.src = "./images/"+files+name;

		return image;
	}
	return getImage;
});