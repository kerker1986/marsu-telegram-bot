import {v4} from "uuid";

export class Answer {
    private _body: string;
    private _correct: boolean;

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


    set body(value: string) {
        this._body = value;
    }

    set correct(value: boolean) {
        this._correct = value;
    }
}