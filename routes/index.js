var isLoggedIn = require('./middleware/isLoggedIn');

module.exports = function(app){
  app.get('/', function(req, res, next) {
    if (!req.session.user) {
      res.render('index', { title: 'MedImage' });
    } else {
      res.redirect('/main')
    }
  });

  app.get('/demo', function(req, res) {
    res.render('demo/demo', { title: 'API Demo' });
  });

  app.get('/main', isLoggedIn, function(req, res) {
    res.render('main', {title: 'Testing Grid' });
  });


  // TODO: Remove this as well
  app.get('/editorTest', function(req, res) {
    res.render('editorTest', {title: 'Editor testing page'});
  });

  //TODO, REMOVE THIS
  app.get('/userinfo', isLoggedIn, function(req, res, next) {
    res.write("user info is: " + JSON.stringify(req.session.user));
    res.end();
  });
};

