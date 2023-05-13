'use strict';

const { SuccessResponse } = require('../core/success.response');
const { DiscountService } = require('../services/discount.service');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create discount success',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: 'Update discount success',
      metadata: await DiscountService.updateDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeWithProduct = async (req, res) => {
    new SuccessResponse({
      message: 'Get Discount Code success',
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res) => {
    new SuccessResponse({
      message: 'Get all discount codes success',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: 'Get discount amount success',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        // shopId: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: 'Delete discount success',
      metadata: await DiscountService.deleteDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: 'Cancel discount success',
      metadata: await DiscountService.cancelDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
