"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const uuid_1 = require("uuid");
class Question {
    constructor(body, answers, editingAnswerId, id = (0, uuid_1.v4)()) {
        this._body = body;
        this._answers = answers;
        this._editingAnswerId = editingAnswerId;
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
    get editingAnswerId() {
        return this._editingAnswerId;
    }
    set body(value) {
        this._body = value;
    }
    set answers(value) {
        this._answers = value;
    }
    set editingAnswerId(value) {
        this._editingAnswerId = value;
    }
}
exports.Question = Question;
