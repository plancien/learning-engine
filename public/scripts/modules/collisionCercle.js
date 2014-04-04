define(['event_bus'], function(eventBus) {

	eventBus.on('collisionCercle', function(objet1,objet2,rayonObjet1,rayonObjet2) 
	{
	if(Math.abs(objet1.x-objet2.x)+Math.abs(objet1.y-objet2.y)<= rayonObjet1+rayonObjet2)
		return true;
	else
		return false;
	}			
});