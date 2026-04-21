const db = require('../config/db');

// POST /register -> Create user
const register = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const sql = `INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [full_name, email, phone, password]);

        res.status(201).json({ 
            success: true,
            message: "User registered successfully!", 
            user: {
                id: result.insertId,
                full_name: full_name,
                email: email,
                phone: phone
            },
            hasMedicalProfile: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register user. Email might already exist." });
    }
};

// POST /login -> Validate user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
        const [users] = await db.execute(sql, [email, password]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];
        
        // Check if medical profile exists
        const [medicals] = await db.execute('SELECT id FROM medical_profiles WHERE user_id = ?', [user.id]);
        const hasMedicalProfile = medicals.length > 0;

        res.status(200).json({ 
            success: true,
            message: "Login successful!", 
            hasMedicalProfile: hasMedicalProfile,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to login" });
    }
};

module.exports = { register, login };
