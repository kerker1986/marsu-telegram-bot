import express, {Express} from "express";
import {DependencyContainer} from "./src/middleware/DependencyContainer";
import {TelegramBotController} from "./src/controller/TelegramBotController";
import TelegramBot from "node-telegram-bot-api";

const app: Express = express();

const container: DependencyContainer = new DependencyContainer();


try {
    new TelegramBotController(new TelegramBot(process.env.BOT_ACCESS_TOKEN as string, {polling: true}), container.userRepository(), container.testingRepository());
} catch (e) {
    console.log('Error when creating telegram bot')
}

app.listen(process.env.APP_PORT, () => {
    console.log(`App started and listen: ${process.env.APP_PORT} port`);
});
