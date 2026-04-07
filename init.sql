-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `haneulid` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `haneulid`;

-- Create Table `Transaction`
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `group` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `phoneNumber` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Transaction_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Table `Setting`
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `operationalHours` VARCHAR(191) NOT NULL DEFAULT '08:00 - 22:00',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default setting
INSERT IGNORE INTO `Setting` (`id`, `isActive`, `operationalHours`) VALUES ('default', 1, '08:00 - 22:00');
