module.exports = function(app) {

    app.get('/test', function(req, res) {
        res.send('Server is ok !');
    });

    app.get('/', function(req, res) {
        res.render('home.jade');
    });

    app.post("/upload",function(req,res) {
        req.files//
        res.redirect("/")
    });
};
