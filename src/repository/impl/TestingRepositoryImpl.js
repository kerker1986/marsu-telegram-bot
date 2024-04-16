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
                    questions.push(new Question_1.Question(data.questions[i].body, answers, data.questions[i].id));
                }
                return new Testing_1.Testing(data.title, questions, data.id);
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
                    }
                });
            }
            catch (e) {
                console.log(e);
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
