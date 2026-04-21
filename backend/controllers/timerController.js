const db = require('../config/db');

// GET /timer -> Get active timer for user
const getActiveTimer = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header is required" });
        }

        const sql = `SELECT * FROM safety_timers WHERE user_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1`;
        const [timers] = await db.execute(sql, [userId]);

        res.status(200).json(timers.length > 0 ? timers[0] : null);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch active timer" });
    }
};

// POST /timer -> Start a new timer
const startTimer = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header is required" });
        }

        const { duration_minutes } = req.body;

        if (!duration_minutes) {
            return res.status(400).json({ error: "Duration (minutes) is required" });
        }

        // Calculate ends_at
        const endsAt = new Date();
        endsAt.setMinutes(endsAt.getMinutes() + duration_minutes);

        const sql = `
            INSERT INTO safety_timers (user_id, duration_minutes, status, ends_at) 
            VALUES (?, ?, 'active', ?)
        `;
        const [result] = await db.execute(sql, [userId, duration_minutes, endsAt]);

        res.status(201).json({ 
            message: "Timer started",
            timerId: result.insertId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to start timer" });
    }
};

// POST /timer/stop -> Stop active timer
const stopTimer = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header is required" });
        }

        const sql = `UPDATE safety_timers SET status = 'completed' WHERE user_id = ? AND status = 'active'`;
        const [result] = await db.execute(sql, [userId]);

        res.status(200).json({ message: "Active timer stopped successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to stop timer" });
    }
};

module.exports = { getActiveTimer, startTimer, stopTimer };
