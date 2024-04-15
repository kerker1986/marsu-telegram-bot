import {TestingRepository} from "../TestingRepository";
import {PrismaClient} from "@prisma/client";

export class TestingRepositoryImpl implements TestingRepository {

    private readonly dbClient: PrismaClient

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

}