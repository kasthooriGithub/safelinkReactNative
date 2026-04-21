const db = require('../config/db');

// GET /contacts -> Get all contacts for a specific user
const getContacts = async (req, res) => {
    try {
        // We get the user ID from headers (clean way to identify who is making the request)
        const userId = req.headers['x-user-id']; 

        if (!userId) {
            return res.status(400).json({ error: "User ID header (x-user-id) is required" });
        }

        const sql = `SELECT * FROM emergency_contacts WHERE user_id = ?`;
        const [contacts] = await db.execute(sql, [userId]);

        res.status(200).json(contacts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};

// POST /contacts -> Add a new contact
const addContact = async (req, res) => {
    try {
        const { user_id, contact_name, contact_phone, relationship } = req.body;

        if (!user_id || !contact_name || !contact_phone) {
            return res.status(400).json({ error: "user_id, contact_name, and contact_phone are required" });
        }

        const sql = `
            INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, relationship) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [user_id, contact_name, contact_phone, relationship || '']);

        res.status(201).json({ 
            message: "Contact added successfully",
            contactId: result.insertId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add contact" });
    }
};

// DELETE /contacts/:id -> Delete a specific contact
const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;

        const sql = `DELETE FROM emergency_contacts WHERE id = ?`;
        const [result] = await db.execute(sql, [contactId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete contact" });
    }
};

module.exports = { getContacts, addContact, deleteContact };
