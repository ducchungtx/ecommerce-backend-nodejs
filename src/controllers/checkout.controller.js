'use strict';

const { SuccessResponse } = require('../core/success.response');
const { CartService } = require('../services/cart.service');
const { checkoutReview } = require('../services/checkout.service');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Checkout',
      metadata: await checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
