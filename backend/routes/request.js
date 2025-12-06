// backend/routes/request.js (ACTUALIZARE)

const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');

// ... (Ruta POST existentă)
router.post('/', requestController.createRequest);

// Noua Rută: PUT /api/requests/:requestId (Aprobare/Respingere)
router.put('/:requestId', requestController.updateRequestStatus);

module.exports = router;