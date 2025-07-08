import { CONFIG } from "./config.js";

const levels = { debug: 0, info: 1, warn: 2, error: 3 };

/**
 * Logger class for managing application logs with different severity levels.
 * Supports log filtering, in-memory storage, and console output.
 */
export class Logger {
  constructor() {
    this.logs = [];
    this.currentLevel = levels[CONFIG.LOGGING.LEVEL];
  }

  debug(message, data = null) {
    // Log only if level allows
    this._log('debug', message, data);
  }

  info(message, data = null) {
    this._log('info', message, data);
  }
 
  warn(message, data = null) {
    this._log('warn', message, data);
  }

  error(message, error = null) {
     const errorCheck = error?.stack || error?.message || error;
     this._log('error', message, errorCheck);
  }

  /**
   * Internal/private method to store and output logs.
   * Filters logs based on current level and pushes to memory.
   * Also outputs to console.
   * @private
   * @param {string} level - One of: 'debug', 'info', 'warn', 'error'.
   * @param {string} message - The message to log.
   * @param {*} data - Additional data to attach to the log.
   */
  _log(level, message, data) {
    const messageLevel = levels[level];

    if (messageLevel < this.currentLevel) return;

    const timestamp = new Date().toLocaleTimeString();
    const log = { timestamp, level, message, data};
    this.logs.push(log);

    if (this.logs.length >= CONFIG.LOGGING.MAX_LOGS) {
      this.logs.shift() 
    }

     const tag = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      if (data) {
      console.log(tag, data);
    } else {
      console.log(tag);
    }
  }

  /**
   * Returns all stored logs.
   * @returns {Array<Object>} Array of log entries.
   */
  getLogs() {
    return this.logs; 
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
     return this.logs.map(log => JSON.stringify(log)).join('\n');  // Return logs as a string for download
  }

  show() {
    if (this.logs.length === 0) {
      console.log("No logs to display.");
    } else {
      this.logs.forEach(log => {
        const { timestamp, level, message, data } = log;
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
      });
    }
  }
}

/**
 * Singleton instance of Logger for global use.
 * @type {Logger}
 */

export const logger = new Logger();

if (CONFIG.DEBUG_MODE) {
  window.logs = {
    show: () => logger.show(),
    clear: () => logger.clearLogs(),
    get: () => logger.getLogs()
  };
}
