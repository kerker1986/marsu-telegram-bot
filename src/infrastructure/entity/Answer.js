"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
const uuid_1 = require("uuid");
class Answer {
    constructor(body, correct, id = (0, uuid_1.v4)()) {
        this._body = body;
        this._correct = correct;
        this._id = id;
    }
    get body() {
        return this._body;
    }
    get correct() {
        return this._correct;
    }
    get id() {
        return this._id;
    }
    set body(value) {
        this._body = value;
    }
    set correct(value) {
        this._correct = value;
    }
}
exports.Answer = Answer;
