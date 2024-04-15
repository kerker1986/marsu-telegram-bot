"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyContainer = void 0;
const DependencyContainerExistError_1 = require("../infrastructure/errors/DependencyContainerExistError");
const client_1 = require("@prisma/client");
const TestingRepositoryImpl_1 = require("../repository/impl/TestingRepositoryImpl");
const UserRepositoryImpl_1 = require("../repository/impl/UserRepositoryImpl");
const TelegramBotController_1 = require("../controller/TelegramBotController");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const TelegramBotError_1 = require("../infrastructure/errors/TelegramBotError");
class DependencyContainer {
    constructor() {
        if (DependencyContainer.dependencyContainer) {
            throw new DependencyContainerExistError_1.DependencyContainerExistError();
        }
        DependencyContainer.dependencyContainer = this;
        this.dbClient = new client_1.PrismaClient();
        try {
            this.telegramBotController = new TelegramBotController_1.TelegramBotController(new node_telegram_bot_api_1.default(process.env.BOT_ACCESS_TOKEN, { polling: true }), this.userRepository(), this.testingRepository());
        }
        catch (e) {
            throw new TelegramBotError_1.TelegramBotError();
        }
    }
    testingRepository() {
        return new TestingRepositoryImpl_1.TestingRepositoryImpl(this.dbClient);
    }
    userRepository() {
        return new UserRepositoryImpl_1.UserRepositoryImpl(this.dbClient);
    }
}
exports.DependencyContainer = DependencyContainer;
