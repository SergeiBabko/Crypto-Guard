/**
 * Class representing utilities for logging.
 */
export class LoggerUtils {
  /**
   * Prints the credentials information.
   */
  static printCredentials() {
    LoggerUtils.clear();
    LoggerUtils.magenta(
      `╔═════════════════════════════╗
║         CryptoGuard         ║
║                             ║
║     © 2024 Sergei Babko     ║
║     All Rights Reserved     ║
╚═════════════════════════════╝`
    );
    LoggerUtils.indent();
  }

  /**
   * Prints a thank-you message.
   */
  static sayThanks() {
    LoggerUtils.magenta(
      `╔═════════════════════════════╗
║     Thank You For Using     ║
║         CryptoGuard         ║
╚═════════════════════════════╝`
    );
    LoggerUtils.indent();
  }

  /**
   * Clears the console.
   */
  static clear() {
    console.clear();
  }

  /**
   * Logs messages to the console.
   * @param {...any} args - Messages to log.
   */
  static log(...args) {
    console.log(...args);
  }

  /**
   * Adds an empty line for indentation.
   */
  static indent() {
    LoggerUtils.log();
  }

  /**
   * Logs a message in cyan color.
   * @param {string} message - The message to log.
   */
  static cyan(message) {
    LoggerUtils.log('\x1b[96m%s\x1b[0m', message);
  }

  /**
   * Logs a message in green color.
   * @param {string} message - The message to log.
   */
  static green(message) {
    LoggerUtils.log('\x1b[92m%s\x1b[0m', message);
  }

  /**
   * Logs a message in yellow color.
   * @param {string} message - The message to log.
   */
  static yellow(message) {
    LoggerUtils.log('\x1b[93m%s\x1b[0m', message);
  }

  /**
   * Logs a message in red color.
   * @param {string} message - The message to log.
   */
  static red(message) {
    LoggerUtils.log('\x1b[91m%s\x1b[0m', message);
  }

  /**
   * Logs a message in magenta color.
   * @param {string} message - The message to log.
   */
  static magenta(message) {
    LoggerUtils.log('\x1b[95m%s\x1b[0m', message);
  }

  /**
   * Prints a message along with the result.
   * @param {string} message - The message to print.
   * @param {string} result - The result to print.
   */
  static printResult(message, result) {
    LoggerUtils.green(message);
    LoggerUtils.yellow(result);
    LoggerUtils.indent();
  }
}
