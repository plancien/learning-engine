
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var fs = require('fs');


function findUser(name, callback){
	var file = __dirname+"/../bdd/userList.json";
	fs.readFile(file, 'utf8', function (err, data) {
        console.log("ejeje");
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

function getUserImageSync(name) {
    var file = __dirname+"/../bdd/user/"+name+".json";
    var data = fs.readFileSync(file);
    var user = JSON.parse(data);
    return user.img;
}

function saveUser(name,password,callback) {
    var file = __dirname+"/../bdd/userList.json";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
     
        data = JSON.parse(data);
        console.dir(data, name);

        if (data[name]){
            return callback(new Error("username allready exist"));
        } else {
            data[name] = password;
            fs.writeFile(file,JSON.stringify(data,null,4),function(){
                var userFile = {
                    "img" : [],
                    "game" : []
                };

                pathUser = __dirname+"/../bdd/user/"+name+".json";
                fs.writeFile(pathUser, JSON.stringify(userFile, null, 4), callback);
            });
        }
    }); 
}

function addImage(imageName, userName){
    var pathUser = __dirname+"/../bdd/user/"+userName+".json";
    fs.readFile(pathUser, 'utf8', function (err, data) {
        var file = JSON.parse(data);
        file.img.push(imageName);
        fs.writeFile(pathUser, JSON.stringify(file, null, 4), function(){});
    });
}
function addSessionGame(userName, gameName){
    console.log("Nom du jeu : " + gameName);
        
    var pathUser = __dirname+"/../bdd/user/"+userName+".json";
    fs.readFile(pathUser, 'utf8', function (err, data) {
        var file = JSON.parse(data);
        file.game.push(gameName);
        fs.writeFile(pathUser, JSON.stringify(file, null, 4), function(){});
    });

}
function getSessionGame(userName, callback){
    var pathUser = __dirname+"/../bdd/user/"+userName+".json";
    fs.readFile(pathUser, 'utf8', function (err, data) {
        var file = JSON.parse(data);
        console.log("donnee file.game de user : " + data);
            
        callback(file.game);
    });    
}

var file = __dirname + '/test.json';


passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username , function(mdp) {
        console.log("hey");
        console.log(mdp,password)
      if (!mdp) {
        return done(null, false, { message: 'Pseudo incorrect.' } );
      }
      if (mdp !== password) {
        return done(null, false, { message: 'Mot de passe inccorect.' });
      }
      console.log("----------------")
      return done(null, username);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(username, done) {
    done(null, username);
});

function registerUserRoute(app) {
    app.get('/login',function(req,res) {
        res.render("login.html");
    });
    app.post('/login',
        passport.authenticate('local', { 
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
    app.post('/signup',function(req,res) {
        saveUser(req.body.username,req.body.password,function(err) {
            if (err) {
                res.send("Error : " + err.message);
            } else {
                res.redirect("/login");
            }
        });
    });
}

module.exports.registerUserRoute = registerUserRoute;
module.exports.addImage = addImage;
module.exports.getUserImageSync = getUserImageSync;
module.exports.getSessionGame = getSessionGame;
module.exports.addSessionGame = addSessionGame;
