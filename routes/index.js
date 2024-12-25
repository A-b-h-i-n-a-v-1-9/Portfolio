const express = require('express');
const router = express.Router();

// Render the main portfolio page (index.ejs)
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;
