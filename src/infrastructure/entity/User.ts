import {StatusEnum} from "@prisma/client"
import {v4} from "uuid"

export class User {
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _userName: string;
    private readonly _telegramId: number;
    private readonly _status: StatusEnum;

    private readonly _id: string;


    constructor(firstName: string, lastName: string, userName: string, telegramId: number, status: StatusEnum, id: string = v4()) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._telegramId = telegramId;
        this._status = status;
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
}
