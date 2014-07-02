define([], function() {
	var getImage = function(name, files, getUrl){
		var files = files || "sprite_sheet";
		files += '/';

		if (getUrl){
			return "/images/games_library/"+files+name;
		}
		else{
			var image = new Image();
			image.src = "/images/games_library/"+files+name;
			return image;
		}
	}
	return getImage;
});