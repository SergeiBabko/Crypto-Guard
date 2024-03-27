import * as fs from 'fs';
import * as path from 'path';
import { ConsoleUtils, CryptoUtils, FSUtils, LoggerUtils } from '../utils/index.mjs';

/**
 * Class representing the CryptoGuard application.
 * Handles automatic and manual encryption and decryption of files and text.
 */
export class CryptoGuard {
  // region PARAMETERS

  /**
   * The name of the file storing the password.
   * @type {string}
   */
  #autoPasswordFile = 'password';

  /**
   * Default password content of 'password' file.
   * @type {string}
   */
  #autoPasswordDefaultContent = 'This file can be anything you desire, whether it\'s an image, music, text, or any other format.\nThe binary data extracted from this file will serve as the automatic password for encryption and decryption operations.';

  /**
   * The name of the folder containing original files.
   * @type {string}
   */
  #autoOriginalFolder = 'Original Files';

  /**
   * The name of the folder containing encrypted files.
   * @type {string}
   */
  #autoResultEncryptedFolder = 'Encrypted Files';

  /**
   * The name of the folder containing decrypted files.
   * @type {string}
   */
  #autoResultDecryptedFolder = 'Decrypted Files';

  /**
   * The name of the folder for manual operation results.
   * @type {string}
   */
  #manualResultFolder = 'Manual';

  /**
   * The name of the file for storing encrypted text manually.
   * @type {string}
   */
  #manualResultEncryptedFile = 'Encrypted.txt';

  /**
   * The name of the file for storing decrypted text manually.
   * @type {string}
   */
  #manualResultDecryptedFile = 'Decrypted.txt';

  /**
   * The file path of the password file.
   * @type {string}
   */
  #passwordFilePath;

  /**
   * The folder path for manual operation results.
   * @type {string}
   */
  #manualResultFolderPath;

  /**
   * The folder path for original files.
   * @type {string}
   */
  #originalFilesFolderPath;

  /**
   * The folder path for encrypted files.
   * @type {string}
   */
  #encryptedFilesFolderPath;

  /**
   * The folder path for decrypted files.
   * @type {string}
   */
  #decryptedFilesFolderPath;

  // endregion PARAMETERS

  /**
   * Constructs a new CryptoGuard instance.
   * Initializes file paths and creates necessary folders and files.
   */
  constructor() {
    this.#passwordFilePath = FSUtils.getPath(this.#autoPasswordFile);
    this.#manualResultFolderPath = FSUtils.getPath(this.#manualResultFolder);
    this.#originalFilesFolderPath = FSUtils.getPath(this.#autoOriginalFolder);
    this.#encryptedFilesFolderPath = FSUtils.getPath(this.#autoResultEncryptedFolder);
    this.#decryptedFilesFolderPath = FSUtils.getPath(this.#autoResultDecryptedFolder);
    this.#createInitialFoldersAndFiles();
  }

  // region AUTO

  /**
   * Encrypts files automatically.
   * Scans the original files folder, encrypts each file, and saves the encrypted versions to the encrypted files folder.
   */
  autoEncrypt() {
    let encryptedFilesCount = 0;
    const password = this.#chosePassword();
    FSUtils.clearDirectoryContent(this.#encryptedFilesFolderPath);
    LoggerUtils.yellow('Encrypting data. This may take a moment...');

    const readFiles = (source) => {
      fs.readdirSync(source).forEach((file) => {
        const sourcePath = path.join(source, file);
        if (fs.statSync(sourcePath).isDirectory()) {
          readFiles(sourcePath);
        } else {
          const innerPath = source.split(this.#originalFilesFolderPath + path.sep)[1];
          const encryptedPath = innerPath?.split(path.sep).reduce((encrypted, folderPath) => {
            return path.join(encrypted, CryptoUtils.encrypt(folderPath, password));
          }, '');
          const destination = path.join(this.#encryptedFilesFolderPath, encryptedPath || '');
          const encryptedFileName = CryptoUtils.encrypt(file, password);
          const originalBuffer = fs.readFileSync(sourcePath);
          const encryptedBuffer = CryptoUtils.encrypt(originalBuffer, password);
          FSUtils.overwriteFile(encryptedFileName, encryptedBuffer, destination);
          encryptedFilesCount++;
        }
      });
    };

    readFiles(this.#originalFilesFolderPath);

    this.#autoResultMessage(
      encryptedFilesCount,
      'Encrypt',
      'Original',
      this.#encryptedFilesFolderPath,
      this.#originalFilesFolderPath
    );
  }

  /**
   * Decrypts files automatically.
   * Scans the encrypted files folder, decrypts each file, and saves the decrypted versions to the decrypted files folder.
   */
  autoDecrypt() {
    let decryptedFilesCount = 0;
    const password = this.#chosePassword();
    FSUtils.removeDirectory(this.#decryptedFilesFolderPath);
    LoggerUtils.yellow('Decrypting data. It\'s almost there...');

    const readFiles = (source) => {
      fs.readdirSync(source).forEach((file) => {
        const sourcePath = path.join(source, file);
        if (fs.statSync(sourcePath).isDirectory()) {
          readFiles(sourcePath);
        } else {
          const innerPath = source.split(this.#encryptedFilesFolderPath + path.sep)[1];
          const decryptedPath = innerPath?.split(path.sep).reduce((encrypted, folderPath) => {
            return path.join(encrypted, CryptoUtils.decrypt(folderPath, password));
          }, '');
          const destination = path.join(this.#decryptedFilesFolderPath, decryptedPath || '');
          const decryptedFileName = CryptoUtils.decrypt(file, password);
          const encryptedBuffer = fs.readFileSync(sourcePath, 'utf8');
          const decryptedBuffer = Buffer.from(CryptoUtils.decrypt(encryptedBuffer, password));
          FSUtils.overwriteFile(decryptedFileName, decryptedBuffer, destination);
          decryptedFilesCount++;
        }
      });
    };

    try {
      readFiles(this.#encryptedFilesFolderPath);
    } catch (e) {
      LoggerUtils.indent();
      LoggerUtils.red('Wrong password. Try again.');
      this.autoDecrypt();
      return;
    }

    this.#autoResultMessage(
      decryptedFilesCount,
      'Decrypt',
      'Encrypted',
      this.#decryptedFilesFolderPath,
      this.#encryptedFilesFolderPath
    );
  }

  /**
   * Chooses a password based on user input or stored file.
   * @returns {string} - User's chosen password.
   */
  #chosePassword() {
    let password;
    LoggerUtils.indent();
    const passwordActions = [{
      name: 'auto',
      action: () => {
        LoggerUtils.indent();
        password = fs.readFileSync(this.#passwordFilePath).toString();
      }
    }, {
      name: 'manual',
      action: () => {
        LoggerUtils.indent();
        password = ConsoleUtils.askForPassword();
      }
    }];

    if (fs.existsSync(this.#passwordFilePath)) {
      ConsoleUtils.executeAction(passwordActions, false, 'Chose password type');
    } else {
      password = ConsoleUtils.askForPassword();
    }

    return password;
  }

  /**
   * Displays the result message after automatic encryption or decryption.
   * @param {number} files - Number of files processed.
   * @param {string} operation - The operation performed (Encrypt/Decrypt).
   * @param {string} title - The title for the operation (Original/Encrypted).
   * @param {string} destinationFolderPath - The destination folder path.
   * @param {string} originalFolderPath - The original folder path.
   */
  #autoResultMessage(files, operation, title, destinationFolderPath, originalFolderPath) {
    LoggerUtils.indent();
    if (files) {
      const dataPath = path.resolve(destinationFolderPath);
      LoggerUtils.printResult(`${operation}ion completed successfully. ${operation}ed files have been successfully saved to:`, dataPath);
    } else {
      const dataPath = path.resolve(originalFolderPath);
      LoggerUtils.yellow(`Nothing to ${operation.toLowerCase()}.`);
      LoggerUtils.printResult(`${title} files should be stored at:`, dataPath);
    }
  }

  // endregion AUTO

  // region MANUAL

  /**
   * Allows manual encryption or decryption.
   * Provides options to the user for manual encryption or decryption of text.
   */
  manualEncryptOrDecrypt() {
    const manualActions = [{
      name: 'encrypt',
      action: () => this.#manualEncryptText()
    }, {
      name: 'decrypt',
      action: () => this.#manualDecryptText()
    }];
    LoggerUtils.indent();
    ConsoleUtils.executeAction(manualActions, false, 'Chose manual action');
  }

  /**
   * Encrypts text manually.
   * Prompts the user to input text, encrypts it using a chosen password, and saves the encrypted result to a file.
   */
  #manualEncryptText() {
    LoggerUtils.indent();
    const texToEncrypt = ConsoleUtils.askForInput('Enter text to encrypt:');
    const password = ConsoleUtils.askForPassword();
    const encryptedText = CryptoUtils.encrypt(texToEncrypt, password);
    LoggerUtils.printResult('Encrypted text:', encryptedText);
    this.#writeManualResultToFile(this.#manualResultEncryptedFile, encryptedText);
  }

  /**
   * Decrypts text manually.
   * Prompts the user to input encrypted text and a password, decrypts the text, and saves the decrypted result to a file.
   */
  #manualDecryptText() {
    LoggerUtils.indent();
    const encryptedText = ConsoleUtils.askForInput('Enter encrypted text:');
    const tryDecrypt = () => {
      const password = ConsoleUtils.askForPassword();
      const decryptedText = CryptoUtils.decrypt(encryptedText, password);
      if (decryptedText !== undefined) {
        LoggerUtils.printResult('Decrypted text:', decryptedText);
        this.#writeManualResultToFile(this.#manualResultDecryptedFile, decryptedText);
      } else {
        LoggerUtils.red('Wrong password. Try again.');
        LoggerUtils.indent();
        tryDecrypt();
      }
    };
    tryDecrypt();
  }

  /**
   * Writes the manual encryption or decryption result to a file.
   * Saves the provided content to a file in the manual operation result folder.
   * @param {string} fileName - The name of the file to write.
   * @param {string} content - The content to write.
   */
  #writeManualResultToFile(fileName, content) {
    const savedFilePath = FSUtils.overwriteFile(fileName, content, this.#manualResultFolderPath);
    if (savedFilePath) LoggerUtils.printResult('Result has been saved to:', savedFilePath);
  }

  // endregion MANUAL

  /**
   * Creates initial folders and files required by the CryptoGuard application.
   * Checks and creates necessary folders and files if they do not exist.
   */
  #createInitialFoldersAndFiles() {
    FSUtils.createDirectory(this.#manualResultFolderPath);
    FSUtils.createDirectory(this.#originalFilesFolderPath);
    FSUtils.createDirectory(this.#encryptedFilesFolderPath);
    FSUtils.createDirectory(this.#decryptedFilesFolderPath);
    FSUtils.createNewFile(this.#autoPasswordFile, this.#autoPasswordDefaultContent);
  }
}
