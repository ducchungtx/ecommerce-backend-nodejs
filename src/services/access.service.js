'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER', // -> áp dụng là sử dụng 1 mã khác
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  /**
   * check this toke used - check hack
   * @param {*} refreshToken
   */
  static handlerRefreshToken = async (refreshToken) => {
    // check xem token nay da duoc su dung chua?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // neu co
    if (foundToken) {
      // decode xem la ai
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      // xóa tat ca token trong keyStore
      await KeyTokenService.deleteByKeyId(userId);
      throw new ForbiddenError('Something wrong happened!!');
    }

    // không tìm thấy
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop was not registed');

    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop was not registed');
    // cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung de lay token moi roi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  /**
   * 1 - check email in db
   * 2 - match password
   * 3 - create a accessToken and refreshToken then save
   * 4 - generate tokens
   * 5 - get data to login
   * @param {*} param0
   */

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError('Shop is not exists.');
    }

    // 2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication error');
    }

    // 3
    // sử dụng cho dự án bình thường
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // 4
    // created token pair
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId: userId.toString(), email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1: check email exists?
    // ko có learn sẽ về object của mongoose với size lớn.
    // có thì chỉ trả về dữ liệu cần thiết thôi
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey, publicKey -> use in large system like aws - key-pairs
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      // sử dụng cho dự án bình thường
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      // public key CryptoGraphy Standarts !

      console.log({
        privateKey,
        publicKey,
      }); // save collection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        // throw new BadRequestError('Error: Shop already registered!');
        return {
          code: 'xxxx',
          message: 'keyStore error',
        };
      } // ->
      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   console.error(error);
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };
}

module.exports = AccessService;
