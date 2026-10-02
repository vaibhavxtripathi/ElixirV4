-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'WAITLISTED');

-- AlterTable
ALTER TABLE "events" ADD COLUMN "maxCapacity" INTEGER;

-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED';
