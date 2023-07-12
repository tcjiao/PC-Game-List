const Game = require('../models/game');
const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';
const sanitizeHtml = require('sanitize-html');
const striptags = require('striptags');



module.exports = {
    index,
    show,
}

async function index(req, res) {
    res.render('games/index', { title: 'Top games'});
  }


async function show (req, res, next) {
    try {
      const gameId = req.params.id;
      const gameDetails = await getGameDetails(gameId);

      res.render('games/show', { game: gameDetails, title: 'Game Details' });
    } catch (error) {
      console.error('Error fetching game details:', error);
      res.render('error', { message: 'Failed to fetch game details' });
    }
  };

  async function getGameDetails(id) {
    try {
      const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch game details');
    }
  }
