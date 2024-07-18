const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateTestToken() {
    const testUsername = "admin"; // Username expected by the application logic
    const expiresIn = '1h'; // Match the expiration used in your login route
    const token = jwt.sign({ username: testUsername }, process.env.JWT_SECRET, { expiresIn });
    return token;
}

module.exports = generateTestToken;
