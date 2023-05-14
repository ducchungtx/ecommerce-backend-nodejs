/**
 * - Add product to cart - user
 * - Reduce product quantity by one - user
 * - increase product quantity by one - user
 * - get cart - user
 * - delete cart - user
 * - delete cart item - user
 */

const { SuccessResponse } = require('../core/success.response');
const { CartService } = require('../services/cart.service');

class CartController {
  /**
   * @desc Add to cart for user
   *
   * @type {function(*, *, *): void}
   * @method POST
   * @url /api/v1/cart
   * @return {}
   */
  addToCart = async (req, res) => {
    new SuccessResponse({
      message: 'Add to cart success',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  /**
   * @desc Update to cart for user
   *
   * @type {function(*, *, *): void}
   * @method PUT
   * @url /api/v1/cart
   * @return {}
   */
  update = async (req, res) => {
    new SuccessResponse({
      message: 'Update to cart success',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  /**
   * @desc Delete item in cart for user
   *
   * @type {function(*, *, *): void}
   * @method DELETE
   * @url /api/v1/cart
   * @return {}
   */
  delete = async (req, res) => {
    new SuccessResponse({
      message: 'Delete cart success',
      metadata: await CartService.deleteItemInCart(req.body),
    }).send(res);
  };

  /**
   * @desc Get cart for user
   *
   * @type {function(*, *, *): void}
   * @method GET
   * @url /api/v1/cart
   * @return {}
   */
  listToCart = async (req, res) => {
    new SuccessResponse({
      message: 'List cart success',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
