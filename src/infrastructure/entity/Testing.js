"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testing = void 0;
const uuid_1 = require("uuid");
class Testing {
    constructor(title, questions, editingQuestionId, id = (0, uuid_1.v4)()) {
        this._title = title;
        this._questions = questions;
        this._editingQuestionId = editingQuestionId;
        this._id = id;
    }
    get title() {
        return this._title;
    }
    get questions() {
        return this._questions;
    }
    get id() {
        return this._id;
    }
    get editingQuestionId() {
        return this._editingQuestionId;
    }
    set title(value) {
        this._title = value;
    }
    set questions(value) {
        this._questions = value;
    }
    set editingQuestionId(value) {
        this._editingQuestionId = value;
    }
}
exports.Testing = Testing;
