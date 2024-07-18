const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressStatusMonitor = require('express-status-monitor');
const routes = require('./routes');

const app = express();

// Middleware for monitoring
app.use(expressStatusMonitor());  // Monitor status
app.use(morgan('combined'));  // HTTP request logger

app.use(bodyParser.json());
app.use('/api', routes);
// app.use('/status', authMiddleware, expressStatusMonitor());


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    // Log the error internally or send to an external logging system
    res.status(500).send('Internal Server Error');
});

// Export the app for testing
module.exports = app;

// Start the server only if running this file directly
if (require.main === module) {
    const port = process.env.PORT || 3300;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
