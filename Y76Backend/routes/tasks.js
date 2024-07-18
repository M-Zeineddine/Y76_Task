const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Tasks');
        res.json(result.recordset);
    } catch (err) {
        console.error(err.message); // Log detailed error
        res.status(500).send('Error fetching tasks');
    }
});


router.post('/', authenticateToken, async (req, res) => {
    const { name, description, is_completed } = req.body;

    // Validate empty fields
    if (!name || !description || is_completed === undefined) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const pool = await poolPromise;
        const existingTask = await pool.request()
            .input('Name', sql.NVarChar, name)
            .query('SELECT * FROM Tasks WHERE Name = @Name');

        if (existingTask.recordset.length > 0) {
            return res.status(409).send("A task with the same name already exists.");
        }

        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar, description)
            .input('Is_Completed', sql.Bit, is_completed)
            .query('INSERT INTO Tasks (Name, Description, Is_Completed) VALUES (@Name, @Description, @Is_Completed)');
        res.status(201).send("Task created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, is_completed } = req.body;

    try {
        const task = await getTaskById(id);
        if (!task) {
            return res.status(404).send("Task with the specified ID not found.");
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar, description)
            .input('Is_Completed', sql.Bit, is_completed)
            .query('UPDATE Tasks SET Name=@Name, Description=@Description, Is_Completed=@Is_Completed WHERE Id=@Id');
        res.send("Task updated successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await getTaskById(id);
        if (!task) {
            return res.status(404).send("Task with the specified ID not found.");
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Tasks WHERE Id=@Id');
        res.send("Task deleted successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});


async function getTaskById(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Tasks WHERE Id = @Id');
        return result.recordset.length ? result.recordset[0] : null;
    } catch (err) {
        throw new Error(err.message);
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send("Access denied. No token provided.");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token.");
        req.user = user;
        next();
    });
}


// Dummy user database simulation
const users = {
    admin: { password: process.env.HASHED_PASSWORD }
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.admin;

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Invalid username or password");
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});


async function hashPassword() {
    const password = 'P@ssw0rd';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
}

hashPassword();

module.exports = router;
