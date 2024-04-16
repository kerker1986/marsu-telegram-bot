import {Question} from "./Question";
import {v4} from "uuid";

export class Testing {
    private _title: string;
    private _questions: Question [];
    private _editingQuestionId: string | null;

    private readonly _id: string;


    constructor(title: string, questions: Question[], editingQuestionId: string | null, id: string = v4()) {
        this._title = title;
        this._questions = questions;
        this._editingQuestionId = editingQuestionId;
        this._id = id;
    }


    get title(): string {
        return this._title;
    }

    get questions(): Question[] {
        return this._questions;
    }

    get id(): string {
        return this._id;
    }

    get editingQuestionId(): string | null {
        return this._editingQuestionId;
    }

    set title(value: string) {
        this._title = value;
    }

    set questions(value: Question[]) {
        this._questions = value;
    }


    set editingQuestionId(value: string | null) {
        this._editingQuestionId = value;
    }
}