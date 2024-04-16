-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "editingAnswerId" TEXT;

-- AlterTable
ALTER TABLE "Testing" ADD COLUMN     "editingQuestionId" TEXT;
