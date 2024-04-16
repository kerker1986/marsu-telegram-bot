import {v4} from "uuid";

export class Answer {
    private readonly _body: string;
    private readonly _correct: boolean;

    private readonly _id: string;


    constructor(body: string, correct: boolean, id: string = v4()) {
        this._body = body;
        this._correct = correct;
        this._id = id;
    }


    get body(): string {
        return this._body;
    }

    get correct(): boolean {
        return this._correct;
    }

    get id(): string {
        return this._id;
    }
}