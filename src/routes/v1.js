const express = require('express');
const router = express.Router();

/* const SaleController = require('../controllers/sale.controller');
const MintController = require('../controllers/mint.controller'); */
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Invalid Request", data: { "version_number": "v1.0.0" } })
});

// user routes
/* router.post('/salecreate', SaleController.create);
router.get('/sales', SaleController.getSales);
router.get('/rankmarkets', SaleController.getMarketsales);
router.post('/mintcreate', MintController.create);
router.get('/mints', MintController.getMints);
router.get('/rankmints', MintController.getMarketmints);
router.get('/getmints', MintController.getEthermints); */

module.exports = router;