define(['event_bus','module/score'], function(eventBus) 
{
	var score = 0;
	var compteur = 0;
	var scoreContainer;

    eventBus.on('init', function(mainContainer) {
        scoreContainer = $('<div id="score"></div>');
        mainContainer.append(scoreContainer);
    });

	eventBus.on('add points', function(points,a) {
        if(points > 0)
        {
        	compteur ++;
        	if(compteur >= a)
        	{
        		points = 2* points;
        	}
        }
        else 
        {
        	compteur = 0;
        }
        score += points;
        scoreContainer.html(score);
    });
