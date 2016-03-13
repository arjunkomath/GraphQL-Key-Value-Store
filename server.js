var express = require('express');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var data = require('./data.json');
var bodyParser = require('body-parser');
var fs = require('fs');

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

var QueryType = new graphql.GraphQLObjectType({
	name: 'Query',
	fields: {
		keyValueStore: {
			type: keyValue,
			args: {
				key: { type: graphql.GraphQLString }
			},
			resolve: (_, args) => {return new Promise((resolve, reject) => {
				var flag = false;
				data.map(function(d){
					if(d.key == args.key) {
						flag = true;
						resolve(d);
					}
				})
				if(!flag)
					resolve(null);
			})
		}
	}
}
});

var MutationAdd = {  
	type: keyValue,
	description: 'Add a key value pair',
	args: {
		key: {
			name: 'Key string',
			type: new graphql.GraphQLNonNull(graphql.GraphQLString)
		},
		value: {
			name: 'Value string',
			type: new graphql.GraphQLNonNull(graphql.GraphQLString)
		}
	},
	resolve: (root, args) => {
		var kvPair =  {
			key: args.key,
			value: args.value
		};
		console.log(kvPair);
		return new Promise((resolve, reject) => {
			var d = data;
			d.push(kvPair);
			console.log(d);
			fs.writeFile("./data.json", JSON.stringify(d), function(err) {
				if(err) {
					return console.log(err);
				}
				resolve(kvPair);
			});
		})
	}
}

var MutationType = new graphql.GraphQLObjectType({  
	name: 'Mutation',
	fields: {
		add: MutationAdd
	}
});

var schema = new graphql.GraphQLSchema({
	query: QueryType,
	mutation: MutationType
});

app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true }));

app.get('/', function (req, res) {
	res.send('Hello GraphQL!');
});

app.listen(3000, function () {
	console.log('Server in ON!');
});