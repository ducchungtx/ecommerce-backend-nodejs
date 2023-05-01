'use strict';

const keyTokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // console.log('userId', userId);
      // lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // console.log('tokens', tokens);
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
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
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findOneAndRemove(new Types.ObjectId(id));
  };

  /**
   * Tìm kiếm token đã được sử dụng
   *
   * @static
   * @param {*} refreshToken
   * @memberof AccessService
   */
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
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
    return await keyTokenModel.findOne({ refreshToken });
  };

  /**
   * Xóa
   *
   * @static
   * @param {*} refreshToken
   * @memberof AccessService
   */
  static deleteByKeyId = async (userId) => {
    console.log('delete', new Types.ObjectId(userId));
    return await keyTokenModel.findByIdAndDelete({
      userId: new Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
