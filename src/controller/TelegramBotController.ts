import {UserRepository} from "../repository/UserRepository";
import {TestingRepository} from "../repository/TestingRepository";
import TelegramBot from "node-telegram-bot-api";
import {User} from "../infrastructure/entity/User";
import BotAnswerEnums from "../infrastructure/BotAnswerEnums";
import {Testing} from "../infrastructure/entity/Testing";
import {Question} from "../infrastructure/entity/Question";
import {Answer} from "../infrastructure/entity/Answer";

export class TelegramBotController {

    private readonly telegramBot: TelegramBot;
    private readonly userRepository: UserRepository;
    private readonly testingRepository: TestingRepository;


    constructor(telegramBot: TelegramBot, userRepository: UserRepository, testingRepository: TestingRepository) {
        this.telegramBot = telegramBot;
        this.userRepository = userRepository;
        this.testingRepository = testingRepository;

        this.telegramBot.on("message", this.onMessage.bind(this));
    }


    async onMessage(message: TelegramBot.Message) {
        try {
            let user: User | null = await this.userRepository.getByTelegramId(message.from?.id as number);

            if (!user) {
                user = await this.createUser(message);
            }

            switch (message.text) {

                case '/start':
                    if (user.status !== 'start') return;

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.start, {
                        reply_markup: {
                            keyboard: [
                                [{text: BotAnswerEnums.BotButtonsText.create_testing}, {text: BotAnswerEnums.BotButtonsText.passing_testing}],
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });

                    break;

                case BotAnswerEnums.BotButtonsText.create_testing :
                    if (user.status !== 'start') return;
                    user.status = "create_testing";
                    user.editingTestingId = (await this.createEmptyTesting(user.id)).id;

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_testing_title, {
                        reply_markup: {
                            keyboard: [
                                [{text: BotAnswerEnums.BotButtonsText.back_to_start}],
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });

                    break;


                case BotAnswerEnums.BotButtonsText.back_to_start :
                    user.status = "start";

                    if (user.editingTestingId) {
                        await this.testingRepository.deleteById(user.editingTestingId);
                        user.editingTestingId = null;
                    }

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.start_reply, {
                        reply_markup: {
                            keyboard: [
                                [{text: BotAnswerEnums.BotButtonsText.create_testing}, {text: BotAnswerEnums.BotButtonsText.passing_testing}],
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });

                    break;


                case BotAnswerEnums.BotButtonsText.add_question:
                    if (user.status !== 'create_question' || !user.editingTestingId) return;

                    const testing: Testing | null = await this.testingRepository.getById(user.editingTestingId);

                    if (!testing) return;

                    testing.editingQuestionId = (await this.createEmptyQuestion(testing.id)).id;

                    await this.testingRepository.update(testing);

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_question_title, {
                        reply_markup: {
                            keyboard: [
                                [{text: BotAnswerEnums.BotButtonsText.back_to_start}],
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });


                    break;

                case BotAnswerEnums.BotButtonsText.add_answer:
                    if (user.status !== 'create_answer' || !user.editingTestingId) return

                    const questionId: string | null | undefined = (await this.testingRepository.getById(user.editingTestingId as string))?.editingQuestionId;

                    if (!questionId) return;

                    const question: Question | null = await this.testingRepository.getQuestionById(questionId);

                    if (!question) return;

                    question.editingAnswerId = (await this.createEmptyAnswer(questionId)).id;

                    await this.testingRepository.updateQuestion(question);

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_answer_title);

                    break;


                case BotAnswerEnums.BotButtonsText.pick_correct_answer:
                    if (user.status !== 'create_answer' || !user.editingTestingId) return;

                    user.status = 'pick_correct_answer';

                    const qId: string | null | undefined = (await this.testingRepository.getById(user.editingTestingId as string))?.editingQuestionId;
                    if (!qId) return;

                    const currentQuestion: Question | null = await this.testingRepository.getQuestionById(qId);

                    if (!currentQuestion) return;

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.pick_correct_answer, {
                        // @ts-ignore
                        keyboard: [...currentQuestion.answers.map((item) => [{text: item.body}])],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    });


                    break;


                default:

                    switch (user.status) {

                        case 'create_answer':

                            if (!message.text) return;

                            const qId: string | null | undefined = (await this.testingRepository.getById(user.editingTestingId as string))?.editingQuestionId;

                            if (!qId) return;

                            const currentQuestion: Question | null = await this.testingRepository.getQuestionById(qId);

                            if (!currentQuestion) return;

                            const answer: Answer | null = await this.testingRepository.getAnswerById(currentQuestion.editingAnswerId as string);

                            if (!answer) return;

                            answer.body = message.text;

                            await this.testingRepository.updateAnswer(answer);

                            user.status = "create_answer";

                            const keyboard = [[{text: BotAnswerEnums.BotButtonsText.add_answer}]];

                            if (currentQuestion?.answers.length >= 2) {
                                keyboard.push([{text: BotAnswerEnums.BotButtonsText.pick_correct_answer}]);
                            }

                            await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_answer_title_save, {
                                reply_markup: {
                                    keyboard,
                                    one_time_keyboard: true,
                                    resize_keyboard: true
                                }
                            });

                            break

                        case 'create_question':
                            if (!message.text) return;

                            const questionId: string | null | undefined = (await this.testingRepository.getById(user.editingTestingId as string))?.editingQuestionId;

                            if (!questionId) return;

                            const question: Question | null = await this.testingRepository.getQuestionById(questionId);

                            if (!question) return;

                            question.body = message.text;

                            await this.testingRepository.updateQuestion(question);

                            user.status = "create_answer";

                            await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_question_title_save, {
                                reply_markup: {
                                    keyboard: [
                                        [{text: BotAnswerEnums.BotButtonsText.add_answer}],
                                    ],
                                    one_time_keyboard: true,
                                    resize_keyboard: true
                                }
                            });

                            break

                        case 'create_testing':
                            if (!message.text) return;

                            const testing: Testing | null = await this.testingRepository.getById(user.editingTestingId as string);

                            if (!testing) return;

                            console.log(message.text)

                            testing.title = message.text;

                            await this.testingRepository.update(testing);

                            user.status = "create_question";

                            await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_testing_title_save, {
                                reply_markup: {
                                    keyboard: [
                                        [{text: BotAnswerEnums.BotButtonsText.back_to_start}, {text: BotAnswerEnums.BotButtonsText.add_question}],
                                    ],
                                    one_time_keyboard: true,
                                    resize_keyboard: true
                                }
                            });

                    }

                    break;
            }

            await this.userRepository.update(user);

        } catch (e) {
            console.log(e);
        }
    }


    async createUser(message: TelegramBot.Message): Promise<User> {
        const user: User = new User(message.from?.first_name as string, message.from?.last_name as string, message.from?.username as string, message.from?.id as number, 'start');
        await this.userRepository.create(user);
        return user;
    }

    async createEmptyTesting(ownerId: string): Promise<Testing> {
        const testing: Testing = new Testing('', [], null);
        await this.testingRepository.create(testing, ownerId);
        return testing;
    }

    async createEmptyQuestion(testingId: string): Promise<Question> {
        const question: Question = new Question('', [], null);
        await this.testingRepository.createQuestion(question, testingId);
        return question;
    }

    async createEmptyAnswer(questionId: string): Promise<Answer> {
        const answer: Answer = new Answer('', false);
        await this.testingRepository.createAnswer(answer, questionId);
        return answer;
    }

}