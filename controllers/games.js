const Game = require('../models/game');
const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';
const sanitizeHtml = require('sanitize-html');
const striptags = require('striptags');
const Mylist = require('../models/mylist');



module.exports = {
    index,
    show,
    update
}

async function index(req, res) {
    res.render('games/index', { title: 'Top games'});
  }


async function show (req, res, next) {
    try {
      const gameId = req.params.id;
      const gameDetails = await getGameDetails(gameId);
      const isPurchased = await Mylist.exists({ gameId: gameId, user: req.user._id, purchased: true });
      const isList = await Mylist.exists({gameId: gameId})

          
      res.render('games/show', { game: gameDetails, title: 'Game Details', isPurchased: isPurchased, isList: isList });
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


  async function update(req, res) {
    const gameId = req.params.id;
     const isPurchased = !!req.body.purchased;
     console.log("ispurchased: ", isPurchased)
     try {
        await Mylist.updateOne({ gameId: gameId, user: req.user._id }, { purchased: isPurchased });
        res.sendStatus(200);
      } catch (error) {
        console.error('Error updating game purchased status:', error);
        res.sendStatus(500);
      }

  }