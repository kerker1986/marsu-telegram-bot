import express, {Express} from "express";
import {DependencyContainer} from "./src/middleware/DependencyContainer";
import {errorHandler} from "./src/middleware/errorHandler";

const app: Express = express();

new DependencyContainer();

app.use(errorHandler);

app.listen(process.env.APP_PORT, () => {
    console.log(`App started and listen: ${process.env.APP_PORT} port`);
});
