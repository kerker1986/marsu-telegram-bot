-- CreateTable
CREATE TABLE "TestingPassing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testingId" TEXT NOT NULL,
    "currentQuestionId" TEXT NOT NULL,

    CONSTRAINT "TestingPassing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassingAnswer" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "testingPassingId" TEXT,

    CONSTRAINT "PassingAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestingPassing" ADD CONSTRAINT "TestingPassing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestingPassing" ADD CONSTRAINT "TestingPassing_testingId_fkey" FOREIGN KEY ("testingId") REFERENCES "Testing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassingAnswer" ADD CONSTRAINT "PassingAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassingAnswer" ADD CONSTRAINT "PassingAnswer_testingPassingId_fkey" FOREIGN KEY ("testingPassingId") REFERENCES "TestingPassing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
