export class DependencyContainerExistError extends Error {
    constructor() {
        super('Dependency container exist');
    }
}