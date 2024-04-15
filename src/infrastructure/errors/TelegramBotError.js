"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotError = void 0;
class TelegramBotError extends Error {
    constructor() {
        super('Cannot create telegram bot');
    }
}
exports.TelegramBotError = TelegramBotError;
