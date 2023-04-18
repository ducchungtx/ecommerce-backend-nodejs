'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // lv 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = {
        user: userId,
        update: {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options: { upsert: true, new: true },
      };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.findOneAndRemove(Types.ObjectId(id));
  };

  /**
   * Tìm kiếm token đã được sử dụng
   *
   * @static
   * @param {*} refreshToken
   * @memberof AccessService
   */
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  /**
   * Find by refreshToken
   *
   * @static
   * @param {*} refreshToken
   * @memberof KeyTokenService
   */
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  /**
   * Xóa
   *
   * @static
   * @param {*} refreshToken
   * @memberof AccessService
   */
  static deleteByKeyId = async (userId) => {
    return await keytokenModel.findByIdAndDelete({ userId }).lean();
  };
}

module.exports = KeyTokenService;
