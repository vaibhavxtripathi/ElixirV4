-- CreateTable
CREATE TABLE "public"."mentor_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_likes_userId_mentorId_key" ON "public"."mentor_likes"("userId", "mentorId");

-- AddForeignKey
ALTER TABLE "public"."mentor_likes" ADD CONSTRAINT "mentor_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mentor_likes" ADD CONSTRAINT "mentor_likes_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
