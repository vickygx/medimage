
/**
 * Rendering pages
 */

module.exports = function(app){
  app.get('/', function(req ,res) {
    res.render('index', { title: 'MedImage' });
  });

  app.get('/demo', function(req, res) {
    res.render('demo/demo', { title: 'API Demo' });
  });

  app.get('/main', function(req, res){
    res.render('main', {title: 'Testing Grid' });
  });
};

