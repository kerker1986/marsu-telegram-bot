export class DatabaseError extends Error {

    constructor(err:any) {
        super(`Database internal error: ${err}`);
    }
}