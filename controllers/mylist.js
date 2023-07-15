const fetch = require('node-fetch');
const apiKey = 'ec348de508f5456dbbde24cb3729bbb9';
const Mylist = require('../models/mylist');


module.exports = {
    showList,
    addtolist,
    delete: deleteGame
}

async function showList (req, res) {
    try {
        const userId = req.user.id; 
    
        const gameIds = await Mylist.find({ user: userId }).distinct('gameId');
    
        const games = await Promise.all(
          gameIds.map(async (gameId) => {
            try {
              const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
              if (response.ok) {
                const gameData = await response.json();
                const game = {
                  id: gameData.id,
                  name: gameData.name,
                  rating: gameData.rating,
                  coverImageUrl: gameData.background_image,
                };
                return game;
              } else {
                console.error(`Error fetching game with ID: ${gameId}`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching game with ID: ${gameId}`);
              return null;
            }
          })
        );
    
        res.render('mylist', { title: 'My List', games });
      } catch (err) {
        console.error('Error fetching game IDs:', err);
        res.redirect('/');
      }
}

async function addtolist (req, res) {
    const gameId = req.body.gameId;
    const userId = req.user._id;

    try {
        const mylist = new Mylist({ 
            gameId: gameId, 
            user: userId,
            purchased: false,
        });
        await mylist.save();
      } catch (error) {
        console.log('Error storing game ID:', error);
      }
    }

async function deleteGame (req, res) {
    const mylistId = req.params.id;

    try {
      const mylist = await Mylist.findOneAndDelete({ gameId: mylistId });
  
      if (mylist) {
        console.log('Game removed from Mylist collection');
      } else {
        console.error('User Mylist document not found');
      }
  
      res.redirect('/mylist');
    } catch (error) {
      console.error('Error removing game from Mylist collection:', error);
      res.redirect('/mylist');
    }
}