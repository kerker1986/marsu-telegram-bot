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
exports.UserRepositoryImpl = void 0;
const User_1 = require("../../infrastructure/entity/User");
class UserRepositoryImpl {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }
    getByTelegramId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.dbClient.user.findFirst({
                    where: {
                        telegramId: id
                    }
                });
                if (!data) {
                    return null;
                }
                return new User_1.User(data.firstName, data.lastName, data.userName, data.telegramId, data.status, data.editingTestingId, data.passingTestingId, data.id);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.user.create({
                    data: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName,
                        telegramId: user.telegramId,
                        status: user.status
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbClient.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName,
                        status: user.status,
                        editingTestingId: user.editingTestingId,
                        passingTestingId: user.passingTestingId,
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
