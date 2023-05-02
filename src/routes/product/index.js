'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

const router = express.Router();

// authentication
router.use(authenticationV2);
// product
router.post('', asyncHandler(productController.createProduct));
router.get('', asyncHandler(productController.products));

module.exports = router;
