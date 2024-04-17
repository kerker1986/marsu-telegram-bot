import {PrismaClient} from "@prisma/client";
import {UserRepository} from "../UserRepository";
import {User} from "../../infrastructure/entity/User";

export class UserRepositoryImpl implements UserRepository {

    private readonly dbClient: PrismaClient

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

    async getByTelegramId(id: number): Promise<User | null> {
        try {
            const data = await this.dbClient.user.findFirst({
                where: {
                    telegramId: id
                }
            });

            if (!data) {
                return null;
            }

            return new User(data.firstName, data.lastName, data.userName, data.telegramId, data.status, data.editingTestingId, data.passingTestingId, data.id);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async create(user: User): Promise<void> {
        try {
            await this.dbClient.user.create({
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    telegramId: user.telegramId,
                    status: user.status
                }
            })
        } catch (e) {
            console.log(e);
        }
    }

    async update(user: User): Promise<void> {
        try {
            await this.dbClient.user.update({
                where: {
                    id: user.id
                },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    status: user.status,
                    editingTestingId: user.editingTestingId,
                    passingTestingId: user.passingTestingId,
                }
            })
        } catch (e) {
            console.log(e);
        }
    }

}