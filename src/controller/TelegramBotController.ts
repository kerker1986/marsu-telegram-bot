import {UserRepository} from "../repository/UserRepository";
import {TestingRepository} from "../repository/TestingRepository";
import TelegramBot from "node-telegram-bot-api";
import {User} from "../infrastructure/entity/User";

export class TelegramBotController {

    private readonly telegramBot: TelegramBot;
    private readonly userRepository: UserRepository;
    private readonly testingRepository: TestingRepository;


    constructor(telegramBot: TelegramBot, userRepository: UserRepository, testingRepository: TestingRepository) {
        this.telegramBot = telegramBot;
        this.userRepository = userRepository;
        this.testingRepository = testingRepository;

        telegramBot.on("message", this.onMessage);
    }


    async onMessage(message: TelegramBot.Message) {
        try {
            let user: User | null = await this.userRepository.getByTelegramId(message.from?.id as number);

            if (!user) {
                user = new User(message.from?.first_name as string, message.from?.last_name as string, message.from?.username as string, message.from?.id as number, 'start');
            }


            switch (message.text) {

                case '/start':

                    break;
            }

            
        } catch (e) {
            console.log(e);
        }
    }

}