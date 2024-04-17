import {UserRepository} from "../repository/UserRepository";
import {TestingRepository} from "../repository/TestingRepository";
import TelegramBot from "node-telegram-bot-api";
import {User} from "../infrastructure/entity/User";
import BotAnswerEnums from "../infrastructure/BotAnswerEnums";
import {Testing} from "../infrastructure/entity/Testing";
import {Question} from "../infrastructure/entity/Question";
import {Answer} from "../infrastructure/entity/Answer";
import {TestingPassing} from "../infrastructure/entity/TestingPassing";

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


                case BotAnswerEnums.BotButtonsText.passing_testing:
                    if (user.status !== 'start') return;

                    user.status = "passing_testing";

                    const testings: Testing[] = await this.testingRepository.getByOwnerId(user.id);

                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.start_reply, {
                        reply_markup: {
                            keyboard: testings.map(testing => [{text: `${testing.title} (${testing.id})`}]),
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
                    if (!['save_testing', 'create_question'].includes(user.status) || !user.editingTestingId) return;

                    if (user.status === 'save_testing') {
                        user.status = 'create_question';
                    }

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
                        reply_markup: {
                            keyboard: currentQuestion.answers.map((item) => [{text: item.body}]),
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });


                    break;


                case BotAnswerEnums.BotButtonsText.save_testing :
                    if (user.status !== 'save_testing') return;

                    if (user.editingTestingId) {

                        const testing: Testing | null = await this.testingRepository.getById(user.editingTestingId);
                        if (testing?.editingQuestionId) {

                            const question: Question | null = await this.testingRepository.getQuestionById(testing.editingQuestionId);

                            if (question?.editingAnswerId) {
                                question.editingAnswerId = null;
                                await this.testingRepository.updateQuestion(question);
                            }

                            testing.editingQuestionId = null;
                            await this.testingRepository.update(testing);
                        }

                        user.editingTestingId = null;
                    }

                    user.status = "start";


                    await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.create_testing_save, {
                        reply_markup: {
                            keyboard: [[{text: BotAnswerEnums.BotButtonsText.create_testing}], [{text: BotAnswerEnums.BotButtonsText.passing_testing}]],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });


                    break;


                default:

                    if (user.status === 'create_answer') {
                        if (!message.text) return;

                        const qId: string | null | undefined = (await this.testingRepository.getById(user.editingTestingId as string))?.editingQuestionId;

                        if (!qId) return;

                        const currentQuestion: Question | null = await this.testingRepository.getQuestionById(qId);

                        if (!currentQuestion) return;

                        const answer: Answer | null = await this.testingRepository.getAnswerById(currentQuestion.editingAnswerId as string);

                        if (!answer) return;

                        answer.body = message.text;

                        await this.testingRepository.updateAnswer(answer);

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

                    }
                    if (user.status === 'create_question') {
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

                    }
                    if (user.status === 'create_testing') {
                        if (!message.text) return;

                        const testing: Testing | null = await this.testingRepository.getById(user.editingTestingId as string);

                        if (!testing) return;

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
                        if (!message.text) return;


                    }
                    if (user.status === "pick_correct_answer") {
                        if (!message.text) return;

                        const answer: Answer | null = await this.testingRepository.getAnswerByBody(message.text);

                        if (!answer) return;

                        answer.correct = true;

                        await this.testingRepository.updateAnswer(answer);

                        user.status = 'save_testing';

                        await this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums.BotMessagesText.pick_correct_answer_save, {
                            reply_markup: {
                                keyboard: [[{text: BotAnswerEnums.BotButtonsText.add_question}], [{text: BotAnswerEnums.BotButtonsText.save_testing}]],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                    }

                    if (user.status === 'pick_answer') {
                        if (!message.text || !user.passingTestingId) return;

                        const tempMessageSplit: string[] = message.text?.split(/[()]/);

                        const id: string = tempMessageSplit[tempMessageSplit?.length - 2];

                        const answer: Answer | null = await this.testingRepository.getAnswerById(id);

                        if (!answer) return null;

                        const testingPassing: TestingPassing | null = await this.testingRepository.getTestingPassingById(user.passingTestingId);

                        if (!testingPassing) return null;

                        const testing: Testing | null = await this.testingRepository.getById(testingPassing.testingId);

                        if (!testing) return null;

                        testingPassing.answers.push(answer);

                        let index: number = testing.questions.findIndex(item => item.id === testingPassing.currentQuestionId);

                        if (index <= -1) return null;

                        index++;

                        if(testing.questions[index]){

                            testingPassing.currentQuestionId = testing.questions[index].id;


                            await this.telegramBot.sendMessage(user.telegramId, testing.questions[index].body, {
                                reply_markup: {
                                    keyboard: testing.questions[index].answers.map(answer => [{text: `${answer.body}(${answer.id})`}]),
                                    one_time_keyboard: true,
                                    resize_keyboard: true
                                }
                            });

                        }else{
                            user.status = 'start';

                            const results: string = `${testingPassing.answers.filter(answer => answer.correct).length}/${testingPassing.answers.length}`

                            await this.telegramBot.sendMessage(user.telegramId, `${BotAnswerEnums.BotMessagesText.passing_testing_save} ${results}`, {
                                reply_markup: {
                                    keyboard: [[{text: BotAnswerEnums.BotButtonsText.create_testing}, {text: BotAnswerEnums.BotButtonsText.passing_testing}],],
                                    one_time_keyboard: true,
                                    resize_keyboard: true
                                }
                            });

                        }

                        await this.testingRepository.updateTestingPassing(testingPassing);





                    }

                    if (user.status === "passing_testing") {
                        if (!message.text) return;

                        const tempMessageSplit: string[] = message.text?.split(/[()]/);

                        const id: string = tempMessageSplit[tempMessageSplit?.length - 2];

                        const testing: Testing | null = await this.testingRepository.getById(id);

                        if (!testing) return null;

                        const testingPassing: TestingPassing = await this.createEmptyTestingPassing(testing, user.id);

                        const question: Question | null = await this.testingRepository.getQuestionById(testingPassing.currentQuestionId);

                        if (!question) return null;

                        user.passingTestingId = testingPassing.id;

                        user.status = "pick_answer";

                        await this.telegramBot.sendMessage(user.telegramId, question.body, {
                            reply_markup: {
                                keyboard: question.answers.map(answer => [{text: `${answer.body} (${answer.id})`}]),
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

    async createEmptyTestingPassing(testing: Testing, userId: string): Promise<TestingPassing> {
        const testingPassing: TestingPassing = new TestingPassing(userId, testing.id, testing.questions[0]?.id);
        await this.testingRepository.createTestingPassing(testingPassing);
        return testingPassing;
    }

}