'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { findAllProducts } = require('../models/repositories/product.repo');
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
  findAllDiscountCodesSelect,
} = require('../models/repositories/discount.repo');
const { convert2ObjectId } = require('../utils');

/**
 * Discount services
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get all discount codes [User | Shop]
 * 3 - Get all discount codes [User } Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount Code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // validate
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(end_date) < new Date(start_date)) {
      throw new BadRequestError('End date more than start date');
    }

    // create index for discount code
    const foundDiscount = discountModel
      .findOne({
        discount_code: code,
        discount_shop_id: convert2ObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists');
    }

    return await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
  }

  static async updateDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_users,
    } = payload;
  }

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shop_id: convert2ObjectId(shopId),
      })
      .lean();

    console.log('foundDiscount', foundDiscount);

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let filter;
    if (discount_applies_to === 'all') {
      // get all
      filter = {
        product_shop: convert2ObjectId(shopId),
        isPublished: true,
      };
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = {
        _id: { $in: discount_product_ids },
        isPublished: true,
      };
    }

    return await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name'],
    });
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    return await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convert2ObjectId(shopId),
        discount_is_active: true,
      },
      select: ['discount_code', 'discount_name'],
      model: discountModel,
    });
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exists`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError('Discount expired');
    if (discount_max_uses === 0) throw new NotFoundError('Discount are out');

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new NotFoundError('Discount code has expired');

    // check xem co gia tri toi thieu hay k
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_order_value > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
        // ..
      }
    }

    // check xem discount nay la fixed amount
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  // delete voucher
  static async deleteDiscountCode({ shopId, codeId }) {
    // kiem tra xem co dk su dung o dau khong, neu k co thi xoa
    return await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: convert2ObjectId(shopId),
    });
  }

  //
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    // check exists
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!discountModel) throw new NotFoundError('Discount not exists');

    return await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1,
      },
    });
  }
}

// Apply discount code
module.exports = {
  DiscountService,
};
