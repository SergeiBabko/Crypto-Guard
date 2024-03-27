import { exec } from 'child_process';
import * as os from 'os';
import { CryptoGuard } from './modules/index.mjs';
import { ConsoleUtils, FSUtils, LoggerUtils } from './utils/index.mjs';

/**
 * Bootstrap function for the CryptoGuard application.
 * Initializes the application, performs cryptographic operations, and handles user interactions.
 */
function main() {
  FSUtils.initializeRoot('./');
  LoggerUtils.printCredentials();
  const cryptoGuard = new CryptoGuard();
  const actionExamples = [{
    name: 'encrypt',
    action: () => cryptoGuard.autoEncrypt()
  }, {
    name: 'decrypt',
    action: () => cryptoGuard.autoDecrypt()
  }, {
    name: 'manual',
    action: () => cryptoGuard.manualEncryptOrDecrypt()
  }];
  ConsoleUtils.executeAction(actionExamples);
  LoggerUtils.sayThanks();
}

/**
 * Check the platform and set console code page to UTF-8 if running on Windows.
 * Otherwise, directly call the main function to start the application.
 */
if (os.platform() === 'win32') {
  exec('chcp 65001', () => main());
} else {
  main();
}
