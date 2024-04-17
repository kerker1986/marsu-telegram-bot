"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotController = void 0;
const User_1 = require("../infrastructure/entity/User");
const BotAnswerEnums_1 = __importDefault(require("../infrastructure/BotAnswerEnums"));
const Testing_1 = require("../infrastructure/entity/Testing");
const Question_1 = require("../infrastructure/entity/Question");
const Answer_1 = require("../infrastructure/entity/Answer");
class TelegramBotController {
    constructor(telegramBot, userRepository, testingRepository) {
        this.telegramBot = telegramBot;
        this.userRepository = userRepository;
        this.testingRepository = testingRepository;
        this.telegramBot.on("message", this.onMessage.bind(this));
    }
    onMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                let user = yield this.userRepository.getByTelegramId((_a = message.from) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    user = yield this.createUser(message);
                }
                switch (message.text) {
                    case '/start':
                        if (user.status !== 'start')
                            return;
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.start, {
                            reply_markup: {
                                keyboard: [
                                    [{ text: BotAnswerEnums_1.default.BotButtonsText.create_testing }, { text: BotAnswerEnums_1.default.BotButtonsText.passing_testing }],
                                ],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                        break;
                    case BotAnswerEnums_1.default.BotButtonsText.create_testing:
                        if (user.status !== 'start')
                            return;
                        user.status = "create_testing";
                        user.editingTestingId = (yield this.createEmptyTesting(user.id)).id;
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_testing_title, {
                            reply_markup: {
                                keyboard: [
                                    [{ text: BotAnswerEnums_1.default.BotButtonsText.back_to_start }],
                                ],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                        break;
                    case BotAnswerEnums_1.default.BotButtonsText.back_to_start:
                        user.status = "start";
                        if (user.editingTestingId) {
                            yield this.testingRepository.deleteById(user.editingTestingId);
                            user.editingTestingId = null;
                        }
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.start_reply, {
                            reply_markup: {
                                keyboard: [
                                    [{ text: BotAnswerEnums_1.default.BotButtonsText.create_testing }, { text: BotAnswerEnums_1.default.BotButtonsText.passing_testing }],
                                ],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                        break;
                    case BotAnswerEnums_1.default.BotButtonsText.add_question:
                        if (user.status !== 'create_question' || !user.editingTestingId)
                            return;
                        const testing = yield this.testingRepository.getById(user.editingTestingId);
                        if (!testing)
                            return;
                        testing.editingQuestionId = (yield this.createEmptyQuestion(testing.id)).id;
                        yield this.testingRepository.update(testing);
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_question_title, {
                            reply_markup: {
                                keyboard: [
                                    [{ text: BotAnswerEnums_1.default.BotButtonsText.back_to_start }],
                                ],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                        break;
                    case BotAnswerEnums_1.default.BotButtonsText.add_answer:
                        if (user.status !== 'create_answer' || !user.editingTestingId)
                            return;
                        const questionId = (_b = (yield this.testingRepository.getById(user.editingTestingId))) === null || _b === void 0 ? void 0 : _b.editingQuestionId;
                        if (!questionId)
                            return;
                        const question = yield this.testingRepository.getQuestionById(questionId);
                        if (!question)
                            return;
                        question.editingAnswerId = (yield this.createEmptyAnswer(questionId)).id;
                        yield this.testingRepository.updateQuestion(question);
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_answer_title);
                        break;
                    case BotAnswerEnums_1.default.BotButtonsText.pick_correct_answer:
                        if (user.status !== 'create_answer' || !user.editingTestingId)
                            return;
                        user.status = 'pick_correct_answer';
                        const qId = (_c = (yield this.testingRepository.getById(user.editingTestingId))) === null || _c === void 0 ? void 0 : _c.editingQuestionId;
                        if (!qId)
                            return;
                        const currentQuestion = yield this.testingRepository.getQuestionById(qId);
                        if (!currentQuestion)
                            return;
                        yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.pick_correct_answer, {
                            // @ts-ignore
                            keyboard: [...currentQuestion.answers.map((item) => [{ text: item.body }])],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        });
                        break;
                    default:
                        switch (user.status) {
                            case 'create_answer':
                                if (!message.text)
                                    return;
                                const qId = (_d = (yield this.testingRepository.getById(user.editingTestingId))) === null || _d === void 0 ? void 0 : _d.editingQuestionId;
                                if (!qId)
                                    return;
                                const currentQuestion = yield this.testingRepository.getQuestionById(qId);
                                if (!currentQuestion)
                                    return;
                                const answer = yield this.testingRepository.getAnswerById(currentQuestion.editingAnswerId);
                                if (!answer)
                                    return;
                                answer.body = message.text;
                                yield this.testingRepository.updateAnswer(answer);
                                user.status = "create_answer";
                                const keyboard = [[{ text: BotAnswerEnums_1.default.BotButtonsText.add_answer }]];
                                if ((currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answers.length) >= 2) {
                                    keyboard.push([{ text: BotAnswerEnums_1.default.BotButtonsText.pick_correct_answer }]);
                                }
                                yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_answer_title_save, {
                                    reply_markup: {
                                        keyboard,
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    }
                                });
                                break;
                            case 'create_question':
                                if (!message.text)
                                    return;
                                const questionId = (_e = (yield this.testingRepository.getById(user.editingTestingId))) === null || _e === void 0 ? void 0 : _e.editingQuestionId;
                                if (!questionId)
                                    return;
                                const question = yield this.testingRepository.getQuestionById(questionId);
                                if (!question)
                                    return;
                                question.body = message.text;
                                yield this.testingRepository.updateQuestion(question);
                                user.status = "create_answer";
                                yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_question_title_save, {
                                    reply_markup: {
                                        keyboard: [
                                            [{ text: BotAnswerEnums_1.default.BotButtonsText.add_answer }],
                                        ],
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    }
                                });
                                break;
                            case 'create_testing':
                                if (!message.text)
                                    return;
                                const testing = yield this.testingRepository.getById(user.editingTestingId);
                                if (!testing)
                                    return;
                                console.log(message.text);
                                testing.title = message.text;
                                yield this.testingRepository.update(testing);
                                user.status = "create_question";
                                yield this.telegramBot.sendMessage(user.telegramId, BotAnswerEnums_1.default.BotMessagesText.create_testing_title_save, {
                                    reply_markup: {
                                        keyboard: [
                                            [{ text: BotAnswerEnums_1.default.BotButtonsText.back_to_start }, { text: BotAnswerEnums_1.default.BotButtonsText.add_question }],
                                        ],
                                        one_time_keyboard: true,
                                        resize_keyboard: true
                                    }
                                });
                        }
                        break;
                }
                yield this.userRepository.update(user);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    createUser(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const user = new User_1.User((_a = message.from) === null || _a === void 0 ? void 0 : _a.first_name, (_b = message.from) === null || _b === void 0 ? void 0 : _b.last_name, (_c = message.from) === null || _c === void 0 ? void 0 : _c.username, (_d = message.from) === null || _d === void 0 ? void 0 : _d.id, 'start');
            yield this.userRepository.create(user);
            return user;
        });
    }
    createEmptyTesting(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const testing = new Testing_1.Testing('', [], null);
            yield this.testingRepository.create(testing, ownerId);
            return testing;
        });
    }
    createEmptyQuestion(testingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = new Question_1.Question('', [], null);
            yield this.testingRepository.createQuestion(question, testingId);
            return question;
        });
    }
    createEmptyAnswer(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = new Answer_1.Answer('', false);
            yield this.testingRepository.createAnswer(answer, questionId);
            return answer;
        });
    }
}
exports.TelegramBotController = TelegramBotController;
