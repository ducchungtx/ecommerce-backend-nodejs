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

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update to publish product success!',
      metadata: await ProductFactoryV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update to unpublish product success!',
      metadata: await ProductFactoryV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  /**
   * Get all drafts
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof ProductController
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft successfully!',
      metadata: await ProductFactoryV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * Get all drafts
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof ProductController
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list publish successfully!',
      metadata: await ProductFactoryV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list getListSearchProduct successfully!',
      metadata: await ProductFactoryV2.getListSearchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list findAllProducts successfully!',
      metadata: await ProductFactoryV2.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findProduct successfully!',
      metadata: await ProductFactoryV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY
}

module.exports = new ProductController();
