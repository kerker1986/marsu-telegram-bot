import {Testing} from "../infrastructure/entity/Testing";
import {Question} from "../infrastructure/entity/Question";
import {Answer} from "../infrastructure/entity/Answer";
import {TestingPassing} from "../infrastructure/entity/TestingPassing";

export interface TestingRepository {

    getById(id: string): Promise<Testing | null>;

    getByOwnerId(ownerId: string): Promise<Testing []>;

    create(testing: Testing, ownerId: string): Promise<void>;

    update(testing: Testing): Promise<void>;

    deleteById(id: string): Promise<void>;

    createQuestion(question: Question, testingId: string): Promise<void>;

    updateQuestion(question: Question): Promise<void>;

    getQuestionById(id: string): Promise<Question | null>;

    createAnswer(answer: Answer, questionId: string): Promise<void>;

    updateAnswer(answer: Answer): Promise<void>;

    getAnswerById(id: string): Promise<Answer | null>;

    getAnswerByBody(body: string): Promise<Answer | null>;

    getTestingPassingById(id: string): Promise<TestingPassing | null>;

    createTestingPassing(testingPassing: TestingPassing): Promise<void>;

    updateTestingPassing(testingPassing: TestingPassing): Promise<void>;

}