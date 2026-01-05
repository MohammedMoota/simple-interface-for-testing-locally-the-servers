-- ============================================
-- FYP Secure Network System - Database Schema
-- ============================================
-- Run this file in MySQL Workbench or CLI:
-- mysql -u root -p < schema.sql
-- ============================================
-- Create Database
CREATE DATABASE IF NOT EXISTS fyp_secure_db;
USE fyp_secure_db;
-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS users;
-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
    is_primary_admin BOOLEAN DEFAULT FALSE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- Seed Primary Admin
-- Password: admin123 (bcrypt hashed)
-- ============================================
INSERT INTO users (
        name,
        email,
        password,
        role,
        is_primary_admin,
        status
    )
VALUES (
        'System Administrator',
        'admin@fypsystem.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlBne8qE8J5fk3N0j3R5ZQx1H2G',
        'Admin',
        TRUE,
        'Active'
    );
-- ============================================
-- Sample Users (Optional - for testing)
-- ============================================
INSERT INTO users (name, email, password, role, status)
VALUES (
        'Mohammed Moota',
        'moham@example.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlBne8qE8J5fk3N0j3R5ZQx1H2G',
        'Admin',
        'Active'
    ),
    (
        'Sarah Connor',
        'sarah@example.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlBne8qE8J5fk3N0j3R5ZQx1H2G',
        'User',
        'Active'
    ),
    (
        'John Doe',
        'john@example.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlBne8qE8J5fk3N0j3R5ZQx1H2G',
        'User',
        'Inactive'
    );
-- ============================================
-- Verification Query
-- ============================================
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_users
FROM users;