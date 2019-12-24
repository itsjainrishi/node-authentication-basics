'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const session = require('express-session');
const mongo = require('mongodb');
const routes      = require('./routes.js');
const auth        = require('./auth.js');

require('dotenv').config();

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug')

const MongoClient = mongo.MongoClient;
const mongoClient = new MongoClient(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect((err, client) => {
	var db = client.db('authbasic');
	
	if(err) {
		console.log('Database error: ' + err);
	} else {
		console.log('Successful database connection');
	
	auth(app, db);
	routes(app, db);

	app.listen(process.env.PORT || 3000, () => {
		console.log("Listening on port " + process.env.PORT);
	});

}});