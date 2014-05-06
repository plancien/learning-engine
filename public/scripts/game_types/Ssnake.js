define([
	'event_bus',
	'modules/canvas',
	'modules/frames',
	'ext_libs/jquery',
    ], 
function(eventBus,Canvas, Frames){
	//Canvas stuff
	var width = 800;
	var height = 600;	

	var canvas = Canvas.create({"width" : width, "height" : height});
	var ctx = canvas.context;
	//Permet de sauver la largeur de la cellule dans une variable pour un contrôle facile
	var controleWitdh = 10;
	var direction;
	var food;
	var score;
	
	//Permet de creer le snake maintenant
	var snake_array;//un ensemble de cellules pour constituer le serpent	
	function init()
	{
	 direction = "right"; //direction par default
	 create_snake();
	 create_food(); // Maintenant, nous pouvons voir la particule alimentaire
	 //permet d'afficher le score
	 score = 0;
	 
	 //Permet de déplacer le serpent présent à l'aide d'une minuterie qui va déclencher la fonction Paint
	 //60ms
	 if(typeof game_loop != "undefined") clearInterval(game_loop);
	 game_loop = setInterval(paint, 60);
	}
	init();
	
	function create_snake()
	{
		var length = 5; //Longueur du serpent
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			//serpent horizontale à partir du haut à gauche
			snake_array.push({x: i, y:0});
		}
	}
	
	//création de la nourriture
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(width-controleWitdh)/controleWitdh), 
			y: Math.round(Math.random()*(height-controleWitdh)/controleWitdh), 
		};
	}
	function paint()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, width, height);
		var newx = snake_array[0].x;
		var newy = snake_array[0].y;
		if(direction == "right") newx++;
		else if(direction == "left") newx--;
		else if(direction == "up") newy--;
		else if(direction == "down") newy++;
		// Cela va redémarrer le jeu si le serpent frappe le mur 
		// Ajoutons le code de collision de corps 
		// Maintenant, si la tête du serpent se cogne dans son corps, le jeu redémarre
		if(newx == -1 || newx == width/controleWitdh || newy == -1 || newy == height/controleWitdh || check_collision(newx, newy, snake_array))
		{
			//redemarrer le game
			init();
			return;
		}
		
		//Permet d'écrire le code pour faire le serpent mange la nourriture
		if(newx == food.x && newy == food.y)
		{
			var tail = {x: newx, y: newy};
			score++;
			//Creation de la nourriture 
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops la dernière cellule
			tail.x = newx; tail.y = newy;
		}
		//Le serpent peut présent manger de la nourriture.
		
		snake_array.unshift(tail); //replace la queue comme la première cellule
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		//dessine la nourriture
		paint_cell(food.x, food.y);
		//dessine le score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, height-5);
	}
	
	// création d'une fonction générique pour dessiner les cellues 
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*controleWitdh, y*controleWitdh, controleWitdh, controleWitdh);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*controleWitdh, y*controleWitdh, controleWitdh, controleWitdh);
	}
	
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//On ajoute les touche du clavier
	$(document).keydown(function(e){
		var key = e.which;
		//on empeche la marche arrière
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
		//Le serpent et mtn controlable avec le clavier
	})	
})