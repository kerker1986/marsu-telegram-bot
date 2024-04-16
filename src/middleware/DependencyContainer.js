"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyContainer = void 0;
const client_1 = require("@prisma/client");
const TestingRepositoryImpl_1 = require("../repository/impl/TestingRepositoryImpl");
const UserRepositoryImpl_1 = require("../repository/impl/UserRepositoryImpl");
class DependencyContainer {
    constructor() {
        if (DependencyContainer.dependencyContainer) {
            console.log('Dependency container already exits');
        }
        DependencyContainer.dependencyContainer = this;
        this.dbClient = new client_1.PrismaClient();
    }
    testingRepository() {
        return new TestingRepositoryImpl_1.TestingRepositoryImpl(this.dbClient);
    }
    userRepository() {
        return new UserRepositoryImpl_1.UserRepositoryImpl(this.dbClient);
    }
}
exports.DependencyContainer = DependencyContainer;
