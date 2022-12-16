const router = require('express').Router();

const controller = require('../controllers/controller.js');

router.get('/email', controller.findByEmail)

router.get('/', controller.readCsvFile)

router.get('/:isbn', controller.findIsbnNo)

router.post('/add', controller.addBookAndMagazine)

module.exports = router