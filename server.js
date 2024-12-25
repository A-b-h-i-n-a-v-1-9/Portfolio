const express = require('express');
const app = express();
const path = require('path');

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Route for index page
app.get('/', (req, res) => {
    res.render('layout', { content: 'index' });  // Pass the content for index page
});

// Route for about page
app.get('/about', (req, res) => {
    res.render('layout', { content: 'about' });  // Pass the content for about page
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
