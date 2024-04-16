"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testing = void 0;
const uuid_1 = require("uuid");
class Testing {
    constructor(title, questions, id = (0, uuid_1.v4)()) {
        this._title = title;
        this._questions = questions;
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
    set title(value) {
        this._title = value;
    }
    set questions(value) {
        this._questions = value;
    }
}
exports.Testing = Testing;
