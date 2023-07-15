const express = require('express');
const router = express.Router();
const mylistCtrl = require('../controllers/mylist')


router.get('/mylist', mylistCtrl.showList);

router.post('/mylist', mylistCtrl.addtolist);

router.delete('/mylist/:id', mylistCtrl.delete);

module.exports = router;