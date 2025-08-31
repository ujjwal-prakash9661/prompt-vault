const express = require('express')

const authMiddleware = require('../middlewares/auth.middleware')
const promptController = require('../controllers/prompt.controller')

const {body} = require('express-validator')

const router = express.Router()

router.post('/', 
[
    body('title').notEmpty().withMessage('title is required'),
    body('content').notEmpty().withMessage('content is required')
],
authMiddleware.authUser, promptController.createPrompt)

router.get('/', authMiddleware.authUser, promptController.getPrompts)

router.get('/categories', authMiddleware.authUser, promptController.getCategories)

router.put('/:id', authMiddleware.authUser, promptController.updatePrompt)

// Place before ":id" to avoid catching "/all" as an id
router.delete('/all', authMiddleware.authUser, promptController.deleteAllPrompts)
router.delete('/:id', authMiddleware.authUser, promptController.deletePrompt)

router.get('/search', authMiddleware.authUser, promptController.searchPrompts)

router.post('/import', authMiddleware.authUser, promptController.bulkImport)

module.exports = router