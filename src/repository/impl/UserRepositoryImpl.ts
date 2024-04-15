import {TestingRepository} from "../TestingRepository";
import {PrismaClient} from "@prisma/client";
import {UserRepository} from "../UserRepository";
import {DatabaseError} from "../../infrastructure/errors/DatabaseError";
import {User} from "../../infrastructure/entity/User";

export class UserRepositoryImpl implements UserRepository {

    private readonly dbClient: PrismaClient

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

    async getByTelegramId(id: number): Promise<User | null> {
        try {
            const data = await this.dbClient.user.findFirst({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userName: true,
                    status: true,
                    telegramId: true,
                },
                where: {
                    telegramId: id
                }
            });

            if (!data) {
                return null;
            }

            return new User(data.firstName, data.lastName, data.userName, data.telegramId, data.status, data.id);
        } catch (e) {
            throw new DatabaseError(e);
        }
    }


}