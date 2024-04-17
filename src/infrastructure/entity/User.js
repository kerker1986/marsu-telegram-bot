"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    constructor(firstName, lastName, userName, telegramId, status, editingTestingId = null, passingTestingId = null, id = (0, uuid_1.v4)()) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._telegramId = telegramId;
        this._status = status;
        this._editingTestingId = editingTestingId;
        this._passingTestingId = passingTestingId;
        this._id = id;
    }
    get firstName() {
        return this._firstName;
    }
    get lastName() {
        return this._lastName;
    }
    get userName() {
        return this._userName;
    }
    get telegramId() {
        return this._telegramId;
    }
    get status() {
        return this._status;
    }
    get id() {
        return this._id;
    }
    get editingTestingId() {
        return this._editingTestingId;
    }
    get passingTestingId() {
        return this._passingTestingId;
    }
    set status(value) {
        this._status = value;
    }
    set editingTestingId(value) {
        this._editingTestingId = value;
    }
    set passingTestingId(value) {
        this._passingTestingId = value;
    }
}
exports.User = User;
