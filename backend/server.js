const express = require('express');
const app = express();
require('dotenv').config({ path: '.env' });
const cors = require('cors');

const allowedOrigins = [
    'https://main.dhrimcy1eeyjy.amplifyapp.com',
    'https://www.mclaindex.com',
	'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));



const mysql = require('mysql2');

const db = mysql.createPool({
	connectionLimit: 5,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
  });


app.get('/api/teams', (req, res) => {
	const division = parseInt(req.query.division, 10);
	const year = parseInt(req.query.year, 10);
	const sort_by = req.query.sort_by;

	const allowedSortFields = ["rating", "schedule"];
	if (!allowedSortFields.includes(sort_by)) {
		return res.status(400).json({ error: "Invalid sorting criteria" });
	}

	var query = `SELECT * FROM teams WHERE division = ${division} AND year = ${year} ORDER BY ${sort_by} DESC`;
	db.query(query, (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});

});

app.get('/api/leagues', (req, res) => {
	const division = req.query.division;
	const year = parseInt(req.query.year, 10);

	const query = `SELECT last_updated FROM leagues WHERE division = ? AND year = ?`;
	db.query(query, [division, year], (err, result) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});
});


app.get("/", (req, res) => {
	res.send("Hello, MCLAIndex user!");
});

app.listen(3000, '0.0.0.0', () => {
	console.log(`Listening on port 3000...`);
});
