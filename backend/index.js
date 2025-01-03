const express = require('express');
const app = express();
require('dotenv').config({ path: '../.env' });

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

app.get('/api/teams/', (req, res) => {
	var query = 'SELECT * FROM teams ORDER BY wins DESC LIMIT 10';
	db.query(query, (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});

});

app.get("/", (req, res) => {
	res.send("Hello, lax_stats user!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
