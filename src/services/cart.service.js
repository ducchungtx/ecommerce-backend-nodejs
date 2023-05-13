'use strict';

const cartModel = require('../models/cart.model');

/**
 * Key features: Cart Service
 * - add product to cart [user]
 * - reduce product quantity [user]
 * - increase product quantity [user]
 * - get list to cart [user]
 * - delete cart [user]
 * - delete cart item [user]
 */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
      cart_user_id: userId,
      cart_state: 'active',
    };

    const updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_user_id: userId,
        'cart_products.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({
      cart_user_id: userId,
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }
    // neu co gio hang roi nhung chua co san pham nao
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai va co san san pham thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }
}

module.exports = {
  CartService,
};
