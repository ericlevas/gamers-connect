const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) =>{
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'; font-src fonts.gstatic.com; style-src 'self' fonts.googleapis.com"
	  );
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
	if(req.method==='OPTIONS'){
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true
	})
);
mongoose
	.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
		}@gamersconnect.sjcrg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(8000);
	})
	.catch(err => {
		console.log(err);
	});




