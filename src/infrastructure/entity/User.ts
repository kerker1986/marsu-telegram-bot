import {StatusEnum} from "@prisma/client"
import {v4} from "uuid"
import {Testing} from "./Testing";

export class User {
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _userName: string;
    private readonly _telegramId: number;
    private _status: StatusEnum;
    private _editingTestingId: string | null;
    private _passingTestingId: string | null;

    private readonly _id: string;


    constructor(firstName: string, lastName: string, userName: string, telegramId: number, status: StatusEnum, editingTestingId: string | null = null, passingTestingId: string | null = null, id: string = v4()) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._telegramId = telegramId;
        this._status = status;
        this._editingTestingId = editingTestingId;
        this._passingTestingId = passingTestingId;
        this._id = id;
    }


    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get userName(): string {
        return this._userName;
    }

    get telegramId(): number {
        return this._telegramId;
    }

    get status(): StatusEnum {
        return this._status;
    }

    get id(): string {
        return this._id;
    }


    get editingTestingId(): string | null {
        return this._editingTestingId;
    }


    get passingTestingId(): string | null {
        return this._passingTestingId;
    }

    set status(value: StatusEnum) {
        this._status = value;
    }


    set editingTestingId(value: string | null) {
        this._editingTestingId = value;
    }


    set passingTestingId(value: string | null) {
        this._passingTestingId = value;
    }
}
