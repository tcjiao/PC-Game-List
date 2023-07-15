var express = require('express');
const passport = require('passport');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'PC Game List' });
});

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/games',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});




module.exports = router;



