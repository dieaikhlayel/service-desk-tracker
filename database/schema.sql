-- Creates the database and the tickets table.
-- Safe to run more than once.
CREATE DATABASE IF NOT EXISTS servicedesk_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE servicedesk_db;

CREATE TABLE IF NOT EXISTS tickets (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL,
  category    VARCHAR(30)  NOT NULL,
  priority    VARCHAR(10)  NOT NULL,
  status      VARCHAR(20)  NOT NULL,
  created_at  DATETIME(6)  NOT NULL,
  CONSTRAINT chk_category CHECK (category IN ('HARDWARE','SOFTWARE','NETWORK','ACCOUNT_ACCESS','OTHER')),
  CONSTRAINT chk_priority CHECK (priority IN ('LOW','MEDIUM','HIGH')),
  CONSTRAINT chk_status   CHECK (status   IN ('OPEN','IN_PROGRESS','RESOLVED'))
);