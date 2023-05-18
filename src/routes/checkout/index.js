'use strict';

const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/checkout.controller');

router.post('/review', checkoutController.checkoutReview);

// router
module.exports = router;
