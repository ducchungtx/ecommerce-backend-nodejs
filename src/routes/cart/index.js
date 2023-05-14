'use strict';

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');

router.post('', cartController.addToCart);

router.delete('', cartController.delete);

router.put('', cartController.update);

router.get('', cartController.listToCart);

// router
module.exports = router;
