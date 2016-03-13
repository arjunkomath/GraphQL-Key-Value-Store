var express = require('express');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var data = require('./data.json');
var bodyParser = require('body-parser');
// var promise = require('promise');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

var keyValue = new graphql.GraphQLObjectType({
	name: 'KeyValue',
	fields: {
		key: { type: graphql.GraphQLString },
		value: { type: graphql.GraphQLString },
	}
});

var schema = new graphql.GraphQLSchema({
	query: new graphql.GraphQLObjectType({
		name: 'Query',
		fields: {
			keyValueStore: {
				type: keyValue,
				args: {
					key: { type: graphql.GraphQLString }
				},
				resolve: (_, args) => {return new Promise((resolve, reject) => {
					data.map(function(d){
						if(d.key == args.key) {
							resolve(d);
						}
					})
				})
			}
		}
	}
})
});

app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true }));

app.get('/', function (req, res) {
	res.send('Hello GraphQL!');
});

app.listen(3000, function () {
	console.log('Server in ON!');
});