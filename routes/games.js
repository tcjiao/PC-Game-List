var express = require('express');
var router = express.Router();
const gamesCtrl = require('../controllers/games');

router.get('/', gamesCtrl.index);
  
router.put('/:id/purchase', gamesCtrl.update);

router.get('/:id', gamesCtrl.show);






module.exports = router;



