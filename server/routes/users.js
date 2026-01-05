const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, role, is_primary_admin, status, created_at, updated_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users.'
        });
    }
});

// POST /api/users - Create new user (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.'
            });
        }

        // Check if email already exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'User', 'Active']
        );

        // Fetch created user
        const [newUser] = await pool.query(
            'SELECT id, name, email, role, is_primary_admin, status, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user: newUser[0]
        });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating user.'
        });
    }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, password } = req.body;

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const user = users[0];

        // Prevent modifying primary admin's role
        if (user.is_primary_admin && role && role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot change primary admin role.'
            });
        }

        // Build update query dynamically
        let updateFields = [];
        let updateValues = [];

        if (name) { updateFields.push('name = ?'); updateValues.push(name); }
        if (email) { updateFields.push('email = ?'); updateValues.push(email); }
        if (role) { updateFields.push('role = ?'); updateValues.push(role); }
        if (status) { updateFields.push('status = ?'); updateValues.push(status); }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update.'
            });
        }

        updateValues.push(id);
        await pool.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        // Fetch updated user
        const [updatedUser] = await pool.query(
            'SELECT id, name, email, role, is_primary_admin, status, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'User updated successfully.',
            user: updatedUser[0]
        });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating user.'
        });
    }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const user = users[0];

        // Prevent deleting primary admin
        if (user.is_primary_admin) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete primary administrator.'
            });
        }

        // Prevent self-deletion
        if (parseInt(id) === req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete your own account.'
            });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user.'
        });
    }
});

module.exports = router;
