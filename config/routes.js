module.exports = function(app) {

    app.get('/test', function(req, res) {
        res.send('Server is ok !');
    });

    app.get('/', function(req, res) {
        res.render('home.jade');
    });

};
