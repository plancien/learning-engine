
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


//Ici on recoie les inout du formulaire d'inscrption
	//si les deux mot de passe correspondet
		//on ajoute dans le json
			//On lance une seession du user

//ici on s'occupe des connections
	//si le user existe
		//si le mot de passe correspond avec celui du user
			//on lance une session du user

var fs = require('fs');

function findUser(name, callback){
	var file = __dirname+"/../bdd/userList.json";

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
	 
		data = JSON.parse(data);
	 	
		console.dir(data, name);

		if (data[name]){
			return callback(data[name]);
		}
		else{
			return callback(false);
		}
	});		
}

var file = __dirname + '/test.json';


passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username , function(mdp) {
      if (!mdp) {
        return done(null, false, { message: 'Pseudo incorrect.' } );
      }
      if (mdp !== password) {
        return done(null, false, { message: 'Mot de passe inccorect.' });
      }
      return done(null, username);
    });
  }
));




passport.use(new LocalStrategy(
  function(username, password, done) {
  	if (password === done){

  	}
  	else{
  		return 'les deux mots de passe ne correspondent pas';
  	}
  }
));
