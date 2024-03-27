import * as fs from 'fs';
import * as path from 'path';

/**
 * Class representing utilities for file system operations.
 */
export class FSUtils {
  static #rootPath = '';

  /**
   * Initializes the root path for file operations.
   * @param {string} rootPath - The root path for file operations.
   */
  static initializeRoot(rootPath) {
    this.#rootPath = rootPath;
  }

  /**
   * Gets the full path by joining the root path and folder path.
   * @param {string} folderPath - The folder path.
   * @returns {string} - Full path.
   */
  static getPath(folderPath) {
    return path.join(this.#rootPath, folderPath);
  }

  /**
   * Removes a directory if it exists.
   * @param {string} pathToRemove - The path of the directory to remove.
   */
  static removeDirectory(pathToRemove) {
    if (!fs.existsSync(pathToRemove)) return;
    fs.rmSync(pathToRemove, { recursive: true });
  }

  /**
   * Creates a directory if it does not exist.
   * @param {string} folderPath - The path of the directory to create.
   */
  static createDirectory(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  /**
   * Removes all contents of a directory and creates it if it does not exist.
   * @param {string} folderPath - The path of the directory to clear.
   */
  static clearDirectoryContent(folderPath) {
    this.removeDirectory(folderPath);
    this.createDirectory(folderPath);
  }

  /**
   * Creates a new file with the specified name and content in the specified folder.
   * @param {string} fileName - The name of the new file.
   * @param {string} [content] - The content to write into the file.
   * @param {string} [folderPath] - The path of the folder where the file will be created.
   * @returns {string|null} - Path of the created file or null if the file already exists.
   */
  static createNewFile(fileName, content = '', folderPath = this.#rootPath) {
    const pathToFile = path.join(folderPath, fileName);
    if (fs.existsSync(pathToFile)) return null;
    this.createDirectory(folderPath);
    fs.writeFileSync(pathToFile, content);
    return path.resolve(pathToFile);
  }

  /**
   * Overwrites an existing file with the specified name and content in the specified folder.
   * @param {string} fileName - The name of the file to overwrite.
   * @param {string} [content] - The content to write into the file.
   * @param {string} [folderPath] - The path of the folder where the file is located.
   * @returns {string} - Path of the overwritten file.
   */
  static overwriteFile(fileName, content = '', folderPath = this.#rootPath) {
    this.createDirectory(folderPath);
    const pathToFile = path.join(folderPath, fileName);
    fs.writeFileSync(pathToFile, content);
    return path.resolve(pathToFile);
  }
}
