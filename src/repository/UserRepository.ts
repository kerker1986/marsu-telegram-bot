import {User} from "../infrastructure/entity/User";

export interface UserRepository {

    getByTelegramId(id: number ): Promise<User | null>;

}