-- DropIndex
DROP INDEX "lead_expiresAt_idx";

-- AlterTable
ALTER TABLE "lead" DROP COLUMN "expiresAt";

