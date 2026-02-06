// backend/routes/game.server.routes.js
const games = require('../controllers/game.server.controller');
const requireAuth = require('../middlewares/auth.middleware');

module.exports = function(app) {
    // Public routes
    app.get('/api/games', games.listAll);
    app.post('/api/games', games.create); // Usually admin, but for testing we leave open
    app.get('/api/games/:gameId', games.getGameById);
    app.put('/api/games/:gameId', requireAuth, games.updateGame);

    // Protected routes (User must be logged in)
    app.get('/api/user/collection', requireAuth, games.getUserCollection);
    app.post('/api/user/games', requireAuth, games.addToUserCollection);
    app.delete('/api/user/games/:gameId', requireAuth, games.removeFromCollection);
   
};  