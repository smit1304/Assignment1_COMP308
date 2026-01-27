// backend/routes/user.server.routes.js
const users = require('../controllers/user.server.controller');

module.exports = function(app) {
    app.post('/api/register', users.register);
    app.post('/api/login', users.login);
    app.post('/api/logout', users.logout); // Add this line
};