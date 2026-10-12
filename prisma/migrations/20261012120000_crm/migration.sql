-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadEventType" ADD VALUE 'STATUS_CHANGED';
ALTER TYPE "LeadEventType" ADD VALUE 'NOTE_ADDED';

-- AlterTable
ALTER TABLE "lead" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lead_event" ADD COLUMN     "actorId" TEXT;

-- CreateTable
CREATE TABLE "lead_note" (
    "id" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lead_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_rate_limit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "lastRequest" BIGINT NOT NULL,

    CONSTRAINT "auth_rate_limit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_note_leadId_createdAt_idx" ON "lead_note"("leadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "auth_rate_limit_key_key" ON "auth_rate_limit"("key");

-- CreateIndex
CREATE INDEX "lead_createdAt_id_idx" ON "lead"("createdAt", "id");

-- AddForeignKey
ALTER TABLE "lead_event" ADD CONSTRAINT "lead_event_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_note" ADD CONSTRAINT "lead_note_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_note" ADD CONSTRAINT "lead_note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
