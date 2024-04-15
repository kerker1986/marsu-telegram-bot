import {NextFunction, Request, Response} from "express";
import {DependencyContainerExistError} from "../infrastructure/errors/DependencyContainerExistError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction,) {
    let status: number = 500;
    let statusCode = 'internal';

    if (err instanceof DependencyContainerExistError) {
        statusCode = 'dependencyExist';
    }

    const message = err.message;


    res.status(status).json({statusCode, message});

}