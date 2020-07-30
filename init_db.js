const path = require('path');

const { Database } = require('sqlite3').verbose();

const database = new Database(path.join(__dirname, './database.db'));

database.serialize(() => {
	database.run(`
		DROP TABLE IF EXISTS callers
	`).run(`
		CREATE TABLE callers (
			phonenumber VARCHAR(50) PRIMARY KEY,
			lastname VARCHAR(255),
			firstname VARCHAR(255),
			company VARCHAR(255),
			postal_code VARCHAR(10),
			city VARCHAR(255),
			country VARCHAR(255),
			note CLOB
		);
	`).run(`
		INSERT INTO callers VALUES
			("+461234567890", "Salander", "Lisbeth", "Milton Security", "104 65", "Stockholm", "Sweden", NULL),
			("+492116355550", "Mois", "Tim", "sipgate GmbH", "40219", "Düsseldorf", "Germany", "Had some phone issues last time"),
			("+109876543210", NULL, "Neo", "Meta Cortex", "00000", "Capital City", "Matrix", "Is actually asleep")
		;
	`);
});

database.close();
