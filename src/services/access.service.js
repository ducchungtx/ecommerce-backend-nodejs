'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER', // -> áp dụng là sử dụng 1 mã khác
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exists?
      // ko có learn sẽ về object của mongoose với size lớn.
      // có thì chỉ trả về dữ liệu cần thiết thôi
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop is already registered!',
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        // public key CryptoGraphy Standarts !

        console.log({
          privateKey,
          publicKey,
        }); // save collection KeyStore

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'publicKeyString error',
          };
        }
        console.log('publicKeyString::', publicKeyString);
        // ->
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log('publicKeyObject::', publicKeyObject);
        // ->
        // created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
