export class TelegramBotError extends Error{


    constructor() {
        super('Cannot create telegram bot');
    }
}