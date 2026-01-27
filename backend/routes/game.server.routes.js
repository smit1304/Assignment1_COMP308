// backend/routes/game.server.routes.js
const games = require('../controllers/game.server.controller');
const requireAuth = require('../middlewares/auth.middleware');

module.exports = function(app) {
    // Public routes
    app.get('/api/games', games.listAll);
    app.post('/api/games', games.create); // Usually admin, but for testing we leave open

    // Protected routes (User must be logged in)
    app.get('/api/user/collection', requireAuth, games.getUserCollection);
    app.post('/api/user/games', requireAuth, games.addToUserCollection);
    app.delete('/api/user/games/:gameId', requireAuth, games.removeFromCollection);
    app.get('/api/games/:gameId', games.getGameById);
};  