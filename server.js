const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// initialize app instance
const app = express();

// add cors middleware
app.use(cors());

// object to hold app data
let projectData = {};

/* Middleware, parse body*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('website'));

// server the index page for get on base route
app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'website', 'index.html'));
});

// route to get data
app.get('/data', (req, res) => {
	return res.status(200).json(projectData);
});

//route to save data
app.post('/data', (req, res) => {
	const { temperature, date, userResponse } = req.body;
	const userPayload = { temperature, date, userResponse };
	projectData = userPayload;
	return res.status(201).json({ message: 'Item added', userResponse });
});

// server port, use 5000 in dev and on production use environment port
const PORT = 5000 || process.env.PORT;

// start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
