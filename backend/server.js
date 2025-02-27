const express = require('express');
const app = express();
require('dotenv').config({ path: '.env' });
const cors = require('cors');
app.use(cors());

const mysql = require('mysql2');

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
  });


db.connect((err) => {
	if (err) {
		console.error('Database connection failed:', err.stack);
	} else {
		console.log('Connected to database');
	}
});

app.get('/api/games/', (req, res) => {
	var query = `SELECT * FROM games LIMIT 100`;
	db.query(query, (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});	
});

app.get('/api/games/:team', (req, res) => {
	var team = req.params.team;
	var query = `SELECT * FROM games WHERE team1 = '${team}' OR team2 = '${team}'`;
	db.query(query, (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			if (result.length == 0) res.status(404).send("The team could not be found.");
			res.json(result);
		}
	});	
});

app.get('/api/teams', (req, res) => {
	const division = parseInt(req.query.division, 10);
	const year = parseInt(req.query.year, 10);
	const sort_by = req.query.sort_by;

	const allowedSortFields = ["rating", "schedule"];
	if (!allowedSortFields.includes(sort_by)) {
		return res.status(400).json({ error: "Invalid sorting criteria" });
	}
	// console.log("Fetching teams with id: " + league_id);

	var query = `SELECT * FROM teams WHERE division = ${division} AND year = ${year} ORDER BY ${sort_by} DESC`;
	db.query(query, (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});

});

app.get("/", (req, res) => {
	res.send("Hello, lax_stats user! New backend update");
});

app.listen(3000, '0.0.0.0', () => {
	console.log(`Listening on port 3000...`);
});
