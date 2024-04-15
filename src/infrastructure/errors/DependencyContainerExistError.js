"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyContainerExistError = void 0;
class DependencyContainerExistError extends Error {
    constructor() {
        super('Dependency container exist');
    }
}
exports.DependencyContainerExistError = DependencyContainerExistError;
