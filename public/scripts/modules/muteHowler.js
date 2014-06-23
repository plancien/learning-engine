define(['ext_libs/howler.min'], function(howler){
	var muteButton = document.createElement("button");
	muteButton.setAttribute("style", "float : left");
	muteButton.innerHTML = "Couper le son";

	var muteFunction = function(){
		howler.Howler.mute();
		muteButton.innerHTML = "Activer le son";
		muteButton.onclick = unMuteFunction;
	}
	var unMuteFunction = function(){
		howler.Howler.unmute();
		muteButton.innerHTML = "Couper le son";
		muteButton.onclick = muteFunction;
	}

	muteButton.onclick = muteFunction;
	document.getElementById("container").appendChild(muteButton);
});    	