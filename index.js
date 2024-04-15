"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DependencyContainer_1 = require("./src/middleware/DependencyContainer");
const errorHandler_1 = require("./src/middleware/errorHandler");
const app = (0, express_1.default)();
new DependencyContainer_1.DependencyContainer();
app.use(errorHandler_1.errorHandler);
app.listen(process.env.APP_PORT, () => {
    console.log(`App started and listen: ${process.env.APP_PORT} port`);
});
