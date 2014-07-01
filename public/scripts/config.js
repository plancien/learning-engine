require.config({
	paths: {
		"game_types" 			: "../game_types",
		"connector" 			: "game_systeme/connector",
		"event_bus"				: "game_systeme/event_bus",
		"event_capabilities"  	: "game_systeme/event_capabilities",
		"game"					: "game_systeme/game"
	}
});
require(["main"]);