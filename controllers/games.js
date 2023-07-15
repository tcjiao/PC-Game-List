const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';
const Mylist = require('../models/mylist');



module.exports = {
    index,
    show,
    update,
    shuffleArray,
}

async function index(req, res, next) {
    try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=100&platforms=4&dates=2023-01-01,2023-12-31`
        );
        const data = await response.json();
        const topGames = data.results
          .map(game => ({
            id: game.id,
            name: game.name,
            coverImageUrl: game.background_image,
            rating: game.rating,
          }))
          .filter(game => game.coverImageUrl !== null);
    
      
        const shuffledGames = shuffleArray(topGames);
        const randomGames = shuffledGames.slice(0, 40);
        res.render('games/index', { title: 'Top Games', topGames: randomGames });
      } catch (error) {
        console.error(error);
        res.render('error', { message: 'Failed to fetch top games' });
      }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


async function show(req, res, next) {
    try {
      const gameId = req.params.id;
      const gameDetails = await getGameDetails(gameId);
      let isPurchased = false;
      let isList = false;
      console.log("ispurchased: ", isPurchased);
      if (req.user) {
        isPurchased = await Mylist.exists({ gameId: gameId, user: req.user._id, purchased: true });
        isList = await Mylist.exists({ gameId: gameId });
      }
  
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
    console.log("ispurchased: ", isPurchased);
    
    try {
      await Mylist.updateOne({ gameId: gameId, user: req.user._id }, { purchased: isPurchased });
      return res.redirect(`/games/${gameId}`);
    } catch (error) {
      console.error('Error updating game purchased status:', error);
      res.sendStatus(500);
    }
  }