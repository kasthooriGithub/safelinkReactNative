const db = require('../config/db');

// GET /profile/check -> Check if medical profile exists
const checkMedicalProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header (x-user-id) is required" });
        }

        const [medicals] = await db.execute('SELECT id FROM medical_profiles WHERE user_id = ?', [userId]);
        return res.status(200).json({ hasMedicalProfile: medicals.length > 0 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to check medical profile" });
    }
};

// GET /profile -> Get user profile & medical data
const getProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header (x-user-id) is required" });
        }

        // Fetch User Personal data
        const [users] = await db.execute('SELECT id, full_name, email, phone, age, gender, address FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch Medical Profile data
        const [medicals] = await db.execute('SELECT * FROM medical_profiles WHERE user_id = ?', [userId]);

        res.status(200).json({
            personal: users[0],
            medical: medicals.length > 0 ? medicals[0] : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// POST /profile/medical -> Create or Update Medical Profile
const updateMedicalProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ error: "User ID header (x-user-id) is required" });
        }

        const { blood_group, allergies, medical_conditions, medications, emergency_notes } = req.body;

        // Check if exists
        const [medicals] = await db.execute('SELECT id FROM medical_profiles WHERE user_id = ?', [userId]);

        if (medicals.length > 0) {
            // Update
            const sql = `
                UPDATE medical_profiles 
                SET blood_group = ?, allergies = ?, medical_conditions = ?, medications = ?, emergency_notes = ? 
                WHERE user_id = ?
            `;
            await db.execute(sql, [blood_group || '', allergies || '', medical_conditions || '', medications || '', emergency_notes || '', userId]);
            return res.status(200).json({ message: "Medical profile updated successfully" });
        } else {
            // Insert
            const sql = `
                INSERT INTO medical_profiles (user_id, blood_group, allergies, medical_conditions, medications, emergency_notes) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await db.execute(sql, [userId, blood_group || '', allergies || '', medical_conditions || '', medications || '', emergency_notes || '']);
            return res.status(201).json({ message: "Medical profile created successfully" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save medical profile" });
    }
};

module.exports = { getProfile, updateMedicalProfile, checkMedicalProfile };
