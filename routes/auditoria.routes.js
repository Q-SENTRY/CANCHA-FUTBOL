const express = require('express');
const router  = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { leerUltimas } = require('../middleware/audit');

router.use(authMiddleware, adminOnly);

// GET /api/auditoria?limit=200
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 200, 500);
  res.json(leerUltimas(limit));
});

module.exports = router;
