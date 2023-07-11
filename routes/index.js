var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';


router.get('/', async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=10&platforms=4`
    );
    const data = await response.json();
    const topGames = data.results.map(game => ({
      name: game.name,
      coverImageUrl: game.background_image,
      rating: game.rating,
    })).filter(game => game.coverImageUrl !== null);
    res.render('index', { title: 'Home Page', topGames });
  } catch (error) {
    console.error(error);
    res.render('error', {
      message: 'Failed to fetch top games',
      error: { status: error.status, stack: error.stack },
    });
  }
});

module.exports = router;



