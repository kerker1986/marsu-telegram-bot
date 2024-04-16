import {TestingRepository} from "../TestingRepository";
import {PrismaClient} from "@prisma/client";
import {Testing} from "../../infrastructure/entity/Testing";
import e from "express";
import {Question} from "../../infrastructure/entity/Question";
import {Answer} from "../../infrastructure/entity/Answer";

export class TestingRepositoryImpl implements TestingRepository {

    private readonly dbClient: PrismaClient

    constructor(dbClient: PrismaClient) {
        this.dbClient = dbClient;
    }

    async getById(id: string): Promise<Testing | null> {
        try {

            const data = await this.dbClient.testing.findFirst({
                where: {
                    id
                },
                include: {
                    questions: {
                        include: {
                            answers: true
                        }
                    }
                }
            });

            if (!data) {
                return null;
            }

            const questions: Question[] = [];

            for (let i = 0; i < data.questions.length; i++) {
                const answers: Answer[] = [];

                for (let j = 0; j < data.questions[i].answers.length; j++) {
                    answers.push(new Answer(data.questions[i].answers[j].body, data.questions[i].answers[j].correct, data.questions[i].answers[j].id));
                }

                questions.push(new Question(data.questions[i].body, answers, data.questions[i].id));
            }


            return new Testing(data.title, questions, data.id);
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    async create(testing: Testing, ownerId: string): Promise<void> {
        try {
            await this.dbClient.testing.create({
                data: {
                    id: testing.id,
                    title: testing.title,
                    ownerId
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async update(testing: Testing): Promise<void> {
        try {
            await this.dbClient.testing.update({
                where: {
                    id: testing.id
                },
                data: {
                    title: testing.title,
                }
            });

            // for (let i = 0; i < testing.questions.length; i++) {
            //     await this.dbClient.question.upsert({
            //         where: {
            //             id: testing.questions[i].id
            //         },
            //         update: {
            //             body: testing.questions[i].body
            //         },
            //         create: {
            //             id: testing.questions[i].id,
            //             body: testing.questions[i].body,
            //             testingId: testing.id
            //         }
            //     });
            //     for (let j = 0; j < testing.questions[i].answers.length; j++) {
            //         await this.dbClient.answers.upsert({
            //             where: {
            //                 id: testing.questions[i].answers[j].id
            //             },
            //             update: {
            //                 body: testing.questions[i].answers[j].body,
            //                 correct: testing.questions[i].answers[j].correct
            //             },
            //             create: {
            //                 id: testing.questions[i].answers[j].id,
            //                 body: testing.questions[i].answers[j].body,
            //                 correct: testing.questions[i].answers[j].correct,
            //                 questionId: testing.questions[i].id
            //             }
            //         });
            //     }
            // }
        } catch (e) {
            console.log(e);
        }
    }


    async createQuestion(question: Question, testingId: string): Promise<void> {
        try {
            await this.dbClient.question.create({
                data: {
                    id: question.id,
                    body: question.body,
                    testingId
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async updateQuestion(question: Question): Promise<void> {
        try {
            await this.dbClient.question.update({
                where: {
                    id: question.id
                },
                data: {
                    body: question.body,
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async getQuestionById(id: string): Promise<Question | null> {
        try {
            const data = await this.dbClient.question.findFirst({
                where: {
                    id
                },
                include: {
                    answers: true
                }
            });

            if (!data) {
                return null;
            }

            const answers: Answer[] = [];

            for (let i = 0; i < data.answers.length; i++) {
                answers.push(new Answer(data.answers[i].body, data.answers[i].correct, data.answers[i].id));
            }

            return new Question(data.body, answers, data.editingAnswerId, data.id);

        } catch (e) {
            console.log(e);
            return null;
        }
    }


    async createAnswer(answer: Answer, questionId: string): Promise<void> {
        try {
            await this.dbClient.answers.create({
                data: {
                    id: answer.id,
                    body: answer.body,
                    correct: answer.correct,
                    questionId
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async updateAnswer(answer: Answer): Promise<void> {
        try {
            await this.dbClient.answers.update({
                where: {
                    id: answer.id
                },
                data: {
                    body: answer.body,
                    correct: answer.correct,
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async getAnswerById(id: string): Promise<Answer | null> {
        try {
            const data = await this.dbClient.answers.findFirst({
                where: {
                    id
                }
            });

            if (!data) {
                return null;
            }

            return new Answer(data.body, data.correct, data.id);
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    async deleteById(id: string): Promise<void> {
        try {
            await this.dbClient.testing.delete({
                where: {
                    id
                }
            })
        } catch (e) {
            console.log(e);
        }
    }


}