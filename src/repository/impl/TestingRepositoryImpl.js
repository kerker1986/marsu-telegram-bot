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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingRepositoryImpl = void 0;
const Testing_1 = require("../../infrastructure/entity/Testing");
const Question_1 = require("../../infrastructure/entity/Question");
const Answer_1 = require("../../infrastructure/entity/Answer");
class TestingRepositoryImpl {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.dbClient.testing.findFirst({
                    where: {
                        id
                    },
                    include: {
                        questions: {
                            include: {
                                answers: true
                            }
                        }
                    }
                });
                if (!data) {
                    return null;
                }
                const questions = [];
                for (let i = 0; i < data.questions.length; i++) {
                    const answers = [];
                    for (let j = 0; j < data.questions[i].answers.length; j++) {
                        answers.push(new Answer_1.Answer(data.questions[i].answers[j].body, data.questions[i].answers[j].correct, data.questions[i].answers[j].id));
                    }
                    questions.push(new Question_1.Question(data.questions[i].body, answers, data.questions[i].editingAnswerId, data.questions[i].id));
                }
                return new Testing_1.Testing(data.title, questions, data.editingQuestionId, data.id);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    create(testing, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.testing.create({
                    data: {
                        id: testing.id,
                        title: testing.title,
                        ownerId
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    update(testing) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.testing.update({
                    where: {
                        id: testing.id
                    },
                    data: {
                        title: testing.title,
                        editingQuestionId: testing.editingQuestionId
                    }
                });
                // for (let i = 0; i < testing.questions.length; i++) {
                //     await this.dbClient.question.upsert({
                //         where: {
                //             id: testing.questions[i].id
                //         },
                //         update: {
                //             body: testing.questions[i].body
                //         },
                //         create: {
                //             id: testing.questions[i].id,
                //             body: testing.questions[i].body,
                //             testingId: testing.id
                //         }
                //     });
                //     for (let j = 0; j < testing.questions[i].answers.length; j++) {
                //         await this.dbClient.answers.upsert({
                //             where: {
                //                 id: testing.questions[i].answers[j].id
                //             },
                //             update: {
                //                 body: testing.questions[i].answers[j].body,
                //                 correct: testing.questions[i].answers[j].correct
                //             },
                //             create: {
                //                 id: testing.questions[i].answers[j].id,
                //                 body: testing.questions[i].answers[j].body,
                //                 correct: testing.questions[i].answers[j].correct,
                //                 questionId: testing.questions[i].id
                //             }
                //         });
                //     }
                // }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    createQuestion(question, testingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.question.create({
                    data: {
                        id: question.id,
                        body: question.body,
                        testingId
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    updateQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.question.update({
                    where: {
                        id: question.id
                    },
                    data: {
                        body: question.body,
                        editingAnswerId: question.editingAnswerId,
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.dbClient.question.findFirst({
                    where: {
                        id
                    },
                    include: {
                        answers: true
                    }
                });
                if (!data) {
                    return null;
                }
                const answers = [];
                for (let i = 0; i < data.answers.length; i++) {
                    answers.push(new Answer_1.Answer(data.answers[i].body, data.answers[i].correct, data.answers[i].id));
                }
                return new Question_1.Question(data.body, answers, data.editingAnswerId, data.id);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    createAnswer(answer, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.answers.create({
                    data: {
                        id: answer.id,
                        body: answer.body,
                        correct: answer.correct,
                        questionId
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    updateAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.answers.update({
                    where: {
                        id: answer.id
                    },
                    data: {
                        body: answer.body,
                        correct: answer.correct,
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getAnswerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.dbClient.answers.findFirst({
                    where: {
                        id
                    }
                });
                if (!data) {
                    return null;
                }
                return new Answer_1.Answer(data.body, data.correct, data.id);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.testing.delete({
                    where: {
                        id
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.TestingRepositoryImpl = TestingRepositoryImpl;
