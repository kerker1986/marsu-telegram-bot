"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DependencyContainer_1 = require("./src/middleware/DependencyContainer");
const TelegramBotController_1 = require("./src/controller/TelegramBotController");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const app = (0, express_1.default)();
const container = new DependencyContainer_1.DependencyContainer();
try {
    new TelegramBotController_1.TelegramBotController(new node_telegram_bot_api_1.default(process.env.BOT_ACCESS_TOKEN, { polling: true }), container.userRepository(), container.testingRepository());
}
catch (e) {
    console.log('Error when creating telegram bot');
}
app.listen(process.env.APP_PORT, () => {
    console.log(`App started and listen: ${process.env.APP_PORT} port`);
});
