import {DependencyContainerExistError} from "../infrastructure/errors/DependencyContainerExistError";
import {PrismaClient} from '@prisma/client'
import {TestingRepositoryImpl} from "../repository/impl/TestingRepositoryImpl";
import {TestingRepository} from "../repository/TestingRepository";
import {UserRepository} from "../repository/UserRepository";
import {UserRepositoryImpl} from "../repository/impl/UserRepositoryImpl";
import {TelegramBotController} from "../controller/TelegramBotController";
import TelegramBot from "node-telegram-bot-api";
import {TelegramBotError} from "../infrastructure/errors/TelegramBotError";

export class DependencyContainer {

    private readonly dbClient: PrismaClient;

    static dependencyContainer: DependencyContainer;

    private readonly telegramBotController: TelegramBotController;

    constructor() {
        if (DependencyContainer.dependencyContainer) {
            throw new DependencyContainerExistError();
        }

        DependencyContainer.dependencyContainer = this;
        this.dbClient = new PrismaClient();
        try {
            this.telegramBotController = new TelegramBotController(new TelegramBot(process.env.BOT_ACCESS_TOKEN as string, {polling: true}), this.userRepository(), this.testingRepository());
        }catch (e) {
            throw new TelegramBotError();
        }

    }


    testingRepository(): TestingRepository {
        return new TestingRepositoryImpl(this.dbClient);
    }

    userRepository(): UserRepository {
        return new UserRepositoryImpl(this.dbClient);
    }


}