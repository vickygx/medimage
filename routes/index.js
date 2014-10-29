/*  
*   File that takes care of all the routes dealing with index
*
*   @author: Danny Sanchez, Calvin Li, Vicky Gong
*/

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
    res.render('main', {title: 'MedImage App' });
  });

};

