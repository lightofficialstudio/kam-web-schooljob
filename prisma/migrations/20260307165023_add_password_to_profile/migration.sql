/*
  Warnings:

  - You are about to drop the column `applicant_id` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `subjects` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `school_name` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `teacher_id` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_author_id_fkey";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "applicant_id",
DROP COLUMN "updated_at",
ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "author_id",
DROP COLUMN "salary",
DROP COLUMN "subjects",
DROP COLUMN "type",
ADD COLUMN     "salary_range" TEXT,
ADD COLUMN     "school_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatar_url",
DROP COLUMN "bio",
DROP COLUMN "experience",
DROP COLUMN "headline",
DROP COLUMN "location",
DROP COLUMN "school_name",
DROP COLUMN "skills",
DROP COLUMN "website",
ADD COLUMN     "password" TEXT;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
