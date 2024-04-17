import {Answer} from "./Answer";
import {v4} from "uuid";

export class TestingPassing {
    private readonly _userId: string;
    private readonly _testingId: string;
    private _currentQuestionId: string;
    private _answers: Answer[];

    private readonly _id: string;


    constructor(userId: string, testingId: string, currentQuestionId: string, answers: Answer[] = [], id: string = v4()) {
        this._userId = userId;
        this._testingId = testingId;
        this._currentQuestionId = currentQuestionId;
        this._answers = answers;
        this._id = id;
    }


    get userId(): string {
        return this._userId;
    }

    get testingId(): string {
        return this._testingId;
    }

    get id(): string {
        return this._id;
    }

    get currentQuestionId(): string {
        return this._currentQuestionId;
    }

    set currentQuestionId(value: string) {
        this._currentQuestionId = value;
    }

    get answers(): Answer[] {
        return this._answers;
    }

    set answers(value: Answer[]) {
        this._answers = value;
    }
}