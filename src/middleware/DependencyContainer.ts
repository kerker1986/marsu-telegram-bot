import {PrismaClient} from '@prisma/client'
import {TestingRepositoryImpl} from "../repository/impl/TestingRepositoryImpl";
import {TestingRepository} from "../repository/TestingRepository";
import {UserRepository} from "../repository/UserRepository";
import {UserRepositoryImpl} from "../repository/impl/UserRepositoryImpl";


export class DependencyContainer {

    private readonly dbClient: PrismaClient;

    static dependencyContainer: DependencyContainer;

    constructor() {
        if (DependencyContainer.dependencyContainer) {
            console.log('Dependency container already exits')
        }

        DependencyContainer.dependencyContainer = this;
        this.dbClient = new PrismaClient();

    }


    testingRepository(): TestingRepository {
        return new TestingRepositoryImpl(this.dbClient);
    }

    userRepository(): UserRepository {
        return new UserRepositoryImpl(this.dbClient);
    }


}