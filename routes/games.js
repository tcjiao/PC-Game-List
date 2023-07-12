var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';


router.get('/', async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=50&platforms=4&dates=2023-01-01,2023-12-31`
    );
    const data = await response.json();
    const topGames = data.results
      .map(game => ({
        name: game.name,
        coverImageUrl: game.background_image,
        rating: game.rating,
      }))
      .filter(game => game.coverImageUrl !== null);

    const shuffledGames = shuffleArray(topGames);
    const randomGames = shuffledGames.slice(0, 10);

    res.render('games/index', { title: 'Top Games', topGames: randomGames });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Failed to fetch top games' });
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


module.exports = router;



