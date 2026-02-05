// backend/routes/user.server.routes.js
const users = require('../controllers/user.server.controller');
const requireAuth = require('../middlewares/auth.middleware');

module.exports = function(app) {
    app.post('/api/register', users.register);
    app.post('/api/login', users.login);
    app.post('/api/logout', users.logout); // Add this line
    app.get('/api/me', requireAuth, users.getMe); // Add this line
};

