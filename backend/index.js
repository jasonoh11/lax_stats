const express = require('express');
const app = express();
require('dotenv').config()

const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
  });

connection.connect();

app.get('/api/games', (req, res) => {
	connection.query('SELECT * FROM games', (err, result, fields) => {
		if (err) {
			res.status(500).send('Database query failed');
		} else {
			res.json(result);
		}
	});	
});

app.get("/", (req, res) => {
	res.send("Hello, lacrosse user!");
});

app.listen(3000, () => {
	console.log("I'm listeningggg");
});
