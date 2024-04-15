"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const DependencyContainerExistError_1 = require("../infrastructure/errors/DependencyContainerExistError");
function errorHandler(err, req, res, next) {
    let status = 500;
    let statusCode = 'internal';
    if (err instanceof DependencyContainerExistError_1.DependencyContainerExistError) {
        statusCode = 'dependencyExist';
    }
    const message = err.message;
    res.status(status).json({ statusCode, message });
}
exports.errorHandler = errorHandler;
