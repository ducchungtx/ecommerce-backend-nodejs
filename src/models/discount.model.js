const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount', // percentage
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_day: {
      type: Date,
      required: true,
    },
    discount_end_day: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // so luong discount duoc ap dung
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // so discount da su dung
      type: Number,
      required: true,
    },
    discount_users_used: {
      // ai da su dung
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      // so luong cho phep su dung moi user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      required: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
