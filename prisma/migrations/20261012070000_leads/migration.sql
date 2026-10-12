-- Atomic additive migration; no existing authentication objects changed.
BEGIN;

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "LeadEventType" AS ENUM ('LEAD_CREATED', 'NOTIFICATION_QUEUED', 'NOTIFICATION_SENT', 'NOTIFICATION_FAILED', 'CONFIRMATION_SENT', 'CONFIRMATION_FAILED');

-- CreateEnum
CREATE TYPE "LeadEmailType" AS ENUM ('NOTIFICATION', 'CONFIRMATION');

-- CreateEnum
CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "lead" (
    "id" UUID NOT NULL,
    "idempotencyKey" UUID NOT NULL,
    "requestHash" VARCHAR(64) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "company" VARCHAR(150),
    "phone" VARCHAR(40),
    "service" VARCHAR(20) NOT NULL,
    "budget" VARCHAR(30),
    "message" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" VARCHAR(30) NOT NULL DEFAULT 'contact_form',
    "landingPath" VARCHAR(200),
    "originPath" VARCHAR(200),
    "referrer" VARCHAR(300),
    "utmSource" VARCHAR(150),
    "utmMedium" VARCHAR(150),
    "utmCampaign" VARCHAR(150),
    "utmContent" VARCHAR(150),
    "utmTerm" VARCHAR(150),
    "privacyNoticeVersion" VARCHAR(100) NOT NULL,
    "privacyAcknowledgedAt" TIMESTAMPTZ(6) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_event" (
    "id" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "type" "LeadEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_outbox" (
    "id" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "type" "LeadEmailType" NOT NULL,
    "recipient" VARCHAR(254),
    "sender" VARCHAR(254),
    "status" "EmailOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstAttemptAt" TIMESTAMPTZ(6),
    "lockedUntil" TIMESTAMPTZ(6),
    "lockToken" UUID,
    "lastErrorCode" VARCHAR(60),
    "providerId" VARCHAR(100),
    "sentAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "email_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_rate_bucket" (
    "key" VARCHAR(64) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lead_rate_bucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "lead_idempotencyKey_key" ON "lead"("idempotencyKey");

-- CreateIndex
CREATE INDEX "lead_status_createdAt_idx" ON "lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "lead_service_createdAt_idx" ON "lead"("service", "createdAt");

-- CreateIndex
CREATE INDEX "lead_expiresAt_idx" ON "lead"("expiresAt");

-- CreateIndex
CREATE INDEX "lead_event_leadId_createdAt_idx" ON "lead_event"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "email_outbox_status_nextAttemptAt_idx" ON "email_outbox"("status", "nextAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_outbox_leadId_type_key" ON "email_outbox"("leadId", "type");

-- CreateIndex
CREATE INDEX "lead_rate_bucket_expiresAt_idx" ON "lead_rate_bucket"("expiresAt");

-- AddForeignKey
ALTER TABLE "lead_event" ADD CONSTRAINT "lead_event_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_outbox" ADD CONSTRAINT "email_outbox_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;


COMMIT;
