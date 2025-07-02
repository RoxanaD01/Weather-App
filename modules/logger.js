import { CONFIG } from "./config.js";

const levels = { debug: 0, info: 1, warn: 2, error: 3 };

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
    // Error log with stack trace
     const errorCheck = error?.stack || error?.message || error;
     this._log('error', message, errorCheck);
  }

  // Private method for formatting logs
  _log(level, message, data) {
    const messageLevel = levels[level];

    // If the message level is lower than the current one, do not log
    if (messageLevel < this.currentLevel) return;

    const timestamp = new Date().toLocaleTimeString();
    const log = { timestamp, level, message, data};

    this.logs.push(log);

    // If there are too many logs, delete the oldest one
    if (this.logs.length >= CONFIG.LOGGING.MAX_LOGS) {
      this.logs.shift() 
    }
  }

  getLogs() {
    return this.logs; // return all logs
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
     return this.logs.map(log => JSON.stringify(log)).join('\n');  // Return logs as a string for download
  }
}

// Export a single instance (Singleton pattern)
export const logger = new Logger()


