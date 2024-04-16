import {v4} from "uuid";
import {Answer} from "./Answer";

export class Question {
    private _body: string;
    private _answers: Answer [];
    private _editingAnswerId: string | null;

    private readonly _id: string;


    constructor(body: string, answers: Answer[], editingAnswerId: string | null, id: string = v4()) {
        this._body = body;
        this._answers = answers;
        this._editingAnswerId = editingAnswerId;
        this._id = id;
    }


    get body(): string {
        return this._body;
    }

    get answers(): Answer[] {
        return this._answers;
    }

    get id(): string {
        return this._id;
    }

    get editingAnswerId(): string | null {
        return this._editingAnswerId;
    }


    set body(value: string) {
        this._body = value;
    }

    set answers(value: Answer[]) {
        this._answers = value;
    }

    set editingAnswerId(value: string | null) {
        this._editingAnswerId = value;
    }
}