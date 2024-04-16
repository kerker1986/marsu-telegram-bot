"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const uuid_1 = require("uuid");
class Question {
    constructor(body, answers, id = (0, uuid_1.v4)()) {
        this._body = body;
        this._answers = answers;
        this._id = id;
    }
    get body() {
        return this._body;
    }
    get answers() {
        return this._answers;
    }
    get id() {
        return this._id;
    }
}
exports.Question = Question;
