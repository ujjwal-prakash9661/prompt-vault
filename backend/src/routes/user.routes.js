const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware')
const userController = require('../controllers/user.controller')

const router = express.Router();

router.post('/favourites/:promptId', authMiddleware.authUser, userController.addFavourite);
router.delete('/favourites/:promptId', authMiddleware.authUser, userController.removeFavourite);
router.get('/favourites', authMiddleware.authUser, userController.getFavourites);
router.delete('/favourites', authMiddleware.authUser, userController.clearFavourites);

// Minimal: lifetime prompt count only
router.get('/promptCount', authMiddleware.authUser, userController.getPromptCount);

module.exports = router;

