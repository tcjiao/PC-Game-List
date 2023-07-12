const Game = require('../models/game');

module.exports = {
    index,

}

async function index(req, res) {
    res.render('games/index', { title: 'Top games'});
  }