define(['event_bus', 'modules/mouse', 'modules/collisions'], function(eventBus, mouse, collisions) {  //on créé un nouveau module via require.js



	function dragndrop(movableObject){

		document.body.addEventListener("mousedown", function(event) {
			 

				if (collisionSquareAndPoint(mouse, movableObject)){				//si collision entre la souris et les éléments du groupe collisionable
				document.body.addEventListener("mousemove", onMouseMove);		//on rajoute des listeners pour les clics
				document.body.addEventListener("mouseup", onMouseUp);
				handle = movableObject;							//on transfere l'élément qui collisione dans la variable
				offset.x = mouse.x - handle.x;			//on replace l'élément
				offset.y = mouse.x - handle.y;
			}
		});
	}

		function onMouseMove(event) {
			handle.x = mouse.x;// - offset.x;					//on peut déplacer l'élément variable
			handle.y = mouse.x;// - offset.y;
			
		}

		function onMouseUp(event) {
			document.body.removeEventListener("mousemove", onMouseMove);		//on arrete les Listeners
			document.body.removeEventListener("mouseup", onMouseUp);
		}


return new DragNDrop();

});