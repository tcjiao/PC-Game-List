var express = require('express');
const passport = require('passport');
var router = express.Router();
const fetch = require('node-fetch');
const { listen } = require('../server');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';
let gamesList = [];
const Mylist = require('../models/mylist');


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

router.post('/mylist/add', async (req, res, next) => {
  try {
    const { gameId } = req.body;
    res.redirect('/mylist');
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Failed to add game to list' });
  }
});



module.exports = router;



