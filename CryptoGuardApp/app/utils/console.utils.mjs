import { question } from 'readline-sync';
import { LoggerUtils } from '../utils/index.mjs';

/**
 * Class representing utilities for handling console interactions.
 */
export class ConsoleUtils {
  /**
   * Executes actions based on user input.
   * @param {Array<{name: string, action: Function}>} actions - An array of objects representing actions to execute.   * @param {boolean} [askForRepeat] - Indicates whether to ask for repeating the action.
   * @param {boolean} [askForRepeat] - Indicates whether to ask for repeating the action.
   * @param {string} [header] - The header message to display when asking for action choice.
   */
  static executeAction(actions, askForRepeat = true, header = 'Chose action') {
    const actionNames = actions.reduce((names, action, index) => {
      const actionName = action.name.toLowerCase();
      names += index ? ` | ${actionName}` : actionName;
      return names;
    }, '');

    const tryExecute = (repeat) => {
      const actionName = question(repeat ? `> [${actionNames}]: ` : `${header} [${actionNames}]: `);
      const actionToExecute = actions.find((action) => actionName && action.name.startsWith(actionName.toLowerCase()));
      actionToExecute ? actionToExecute.action() : tryExecute(true);
    };

    tryExecute();
    if (askForRepeat && this.confirmOperation('Execute another operation?')) this.executeAction(actions);
  }

  /**
   * Confirms an operation with the user.
   * @param {string} header - The header message for confirming the operation.
   * @returns {boolean} - User's choice (true for yes, false for no).
   */
  static confirmOperation(header = 'Are you sure?') {
    let choice = false;
    const actions = [{
      name: 'yes',
      action: () => choice = true
    }, {
      name: 'no',
      action: () => choice = false
    }];
    this.executeAction(actions, false, header);
    LoggerUtils.indent();
    return choice;
  }

  /**
   * Prompts the user for input.
   * @param {string} message - The message to display when asking for input.
   * @returns {string} - User input.
   */
  static askForInput(message) {
    LoggerUtils.cyan(message);
    const input = question();
    LoggerUtils.indent();
    return input;
  }

  /**
   * Prompts the user for a password input with hidden echo.
   * @returns {string} - User's password input.
   */
  static askForPassword() {
    LoggerUtils.cyan('Enter password:');
    const password = question('', { hideEchoBack: true });
    LoggerUtils.indent();
    return password;
  }
}
