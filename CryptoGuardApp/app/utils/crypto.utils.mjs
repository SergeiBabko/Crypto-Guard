import { default as CryptoJS } from 'crypto-js';

/**
 * Class representing utilities for cryptographic operations.
 */
export class CryptoUtils {
  /**
   * Mapping of special characters used for encryption.
   * @typedef {Object.<string, string>} CharacterMapping
   */
  static #separatorEncryptionMapping = {
    '/': '☺',
    '\\': '☹',
  };

  /**
   * Mapping of special characters used for decryption.
   * @type {CharacterMapping}
   */
  static #separatorDecryptionMapping = {
    '☺': '/',
    '☹': '\\',
  };

  /**
   * Encrypts text or objects using AES encryption with a given password.
   * @param {string|Object} entity - The text or object to encrypt.
   * @param {string} password - The password used for encryption.
   * @returns {string} - Encrypted text.
   */
  static encrypt(entity, password) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(entity), password).toString();
    return this.#replaceMapping(encrypted, this.#separatorEncryptionMapping);
  }

  /**
   * Decrypts encrypted text using AES decryption with a given password.
   * @param {string} encryptedText - The encrypted text.
   * @param {string} password - The password used for decryption.
   * @returns {string|Object|undefined} - Decrypted text, object or undefined if decryption fails.
   */
  static decrypt(encryptedText, password) {
    const encrypted = this.#replaceMapping(encryptedText, this.#separatorDecryptionMapping);
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    try {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Replaces special characters in the text based on the provided mapping.
   * @param {string} text - The text to process.
   * @param {Object} mapping - The mapping of characters to be replaced.
   * @returns {string} - Processed text.
   * @private
   */
  static #replaceMapping(text, mapping) {
    const search = Object.keys(mapping).join('|').replace('\\', '\\\\');
    const regex = new RegExp(search, 'g');
    return text.replaceAll(regex, (match) => mapping[match]);
  }
}
