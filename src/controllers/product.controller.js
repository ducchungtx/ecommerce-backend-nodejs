'use strict';

const { SuccessResponse } = require('../core/success.response');
const { ProductFactory } = require('../services/product.service');
const ProductFactoryV2 = require('../services/product.service.xxx');

class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'Create new Product success!',
  //     metadata: await ProductFactory.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId,
  //     }),
  //   }).send(res);
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  products = async (req, res, next) => {
    return res.json({
      message: 'Products',
    });
  };
}

module.exports = new ProductController();
