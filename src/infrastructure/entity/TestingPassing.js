"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingPassing = void 0;
const uuid_1 = require("uuid");
class TestingPassing {
    constructor(userId, testingId, currentQuestionId, answers = [], id = (0, uuid_1.v4)()) {
        this._userId = userId;
        this._testingId = testingId;
        this._currentQuestionId = currentQuestionId;
        this._answers = answers;
        this._id = id;
    }
    get userId() {
        return this._userId;
    }
    get testingId() {
        return this._testingId;
    }
    get id() {
        return this._id;
    }
    get currentQuestionId() {
        return this._currentQuestionId;
    }
    set currentQuestionId(value) {
        this._currentQuestionId = value;
    }
    get answers() {
        return this._answers;
    }
    set answers(value) {
        this._answers = value;
    }
}
exports.TestingPassing = TestingPassing;
