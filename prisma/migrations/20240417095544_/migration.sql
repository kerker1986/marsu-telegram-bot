-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_testingId_fkey";

-- DropForeignKey
ALTER TABLE "Testing" DROP CONSTRAINT "Testing_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Testing" ADD CONSTRAINT "Testing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_testingId_fkey" FOREIGN KEY ("testingId") REFERENCES "Testing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
