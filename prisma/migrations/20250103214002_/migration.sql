-- DropEnum
DROP TYPE "crdb_internal_region";

-- CreateTable
CREATE TABLE "Bill" (
    "id" STRING NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "description" STRING NOT NULL,
    "imageUrl" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" STRING NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concert" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "location" STRING NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" STRING,
    "ticketCost" INT4 NOT NULL,
    "imageUrl" STRING,

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConcertAttendence" (
    "id" STRING NOT NULL,
    "ticketId" STRING NOT NULL,
    "concertId" STRING NOT NULL,

    CONSTRAINT "ConcertAttendence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" STRING NOT NULL,
    "concertId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "hashedPassword" STRING NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchItem" (
    "id" STRING NOT NULL,
    "merchImageUrl" STRING NOT NULL,
    "merchPrice" FLOAT8 NOT NULL,
    "merchTitle" STRING NOT NULL,
    "merchDescription" STRING,

    CONSTRAINT "MerchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "hashedPassword" STRING NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountNotification" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "header" STRING NOT NULL,
    "message" STRING NOT NULL,

    CONSTRAINT "AccountNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertAttendence" ADD CONSTRAINT "ConcertAttendence_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcertAttendence" ADD CONSTRAINT "ConcertAttendence_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "Concert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountNotification" ADD CONSTRAINT "AccountNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
