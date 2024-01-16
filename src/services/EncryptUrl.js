import { Base64 } from 'js-base64';
import CryptoJS from 'react-native-crypto-js';
import { baseUrl } from '../services';

export const EncryptUrl = (url, post, log) => {
  return new Promise(async (resolve, reject) => {
    try {
      let endpoint = post ? '/api/decrypt/post?url=' : '/api/decrypt?url=';
      let ciphertext = CryptoJS.AES.encrypt(url, 'monshaat_123').toString();
      let EncryptedUrl = Base64.encode(ciphertext);
      // let EncryptedUrl = encodeURIComponent(ciphertext);
      let completeUrl = baseUrl + endpoint + EncryptedUrl;
      // {
      //   log && console.log(log, completeUrl);
      // }
      resolve(url);
    } catch {
      reject(new Error("can't encrypt url!"));
    }
  });
};
