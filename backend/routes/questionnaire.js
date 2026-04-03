const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const { validateQuestionnaire } = require('../middleware/validation');

router.post('/submit', validateQuestionnaire, questionnaireController.submitQuestionnaire);
router.get('/stats', questionnaireController.getStatistics);

module.exports = router;
