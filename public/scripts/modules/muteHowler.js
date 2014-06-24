define(['ext_libs/howler.min'], function(howler){
	var muteButton = document.createElement("button");
	muteButton.setAttribute("style", "float : left");
	muteButton.innerHTML = "Couper le son";

	var muteFunction = function(){
		howler.Howler.mute();
		muteButton.innerHTML = "Activer le son";
		muteButton.onclick = unMuteFunction;
		sessionStorage.muteHowler = "mute";
	}
	var unMuteFunction = function(){
		howler.Howler.unmute();
		muteButton.innerHTML = "Couper le son";
		muteButton.onclick = muteFunction;
		sessionStorage.muteHowler = "unMute";
	}

	muteButton.onclick = muteFunction;
	document.getElementById("container").appendChild(muteButton);

	if (!sessionStorage.muteHowler){
		sessionStorage.muteHowler = "unMute";
	}
	else if (sessionStorage.muteHowler == "mute"){
		muteFunction();
	}
});
