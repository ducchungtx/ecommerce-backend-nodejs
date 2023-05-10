const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list-product-code',
  asyncHandler(discountController.getAllDiscountCodeWithProduct)
);

// authentication
router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop));
router.get(
  '/search/:keySearch',
  asyncHandler(discountController.cancelDiscountCode)
);

module.exports = router;
