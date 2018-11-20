const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const dynamodb = new AWS.DynamoDB();


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
	console.log('Received event:', JSON.stringify(event, null, 2));
	const id = event.pathParameters ? event.pathParameters.id : null;

	const {
		TABLE_NAME
	} = process.env;

	const done = (err, res) =>
		callback(null, {
			statusCode: err ? "400" : "200",
			body: err ? err.message : JSON.stringify(res),
			headers: {
				"Content-Type": "application/json"
			}
		});

	const payload = JSON.parse(event.body);
	let dynamoParams = {};
	switch (event.httpMethod) {
		case "DELETE":
			dynamoParams = {
				Key: AWS.DynamoDB.Converter.marshall({
					id
				}),
				TableName: TABLE_NAME
			};
			dynamodb.deleteItem(dynamoParams, done);
			break;
		case "GET":
			//queries one specific book
			if (id) {
				dynamoParams = {
					Key: AWS.DynamoDB.Converter.marshall({
						id
					}),
					TableName: TABLE_NAME
				};
				dynamodb.getItem(dynamoParams, done);
			}
			dynamoParams = {
				TableName: TABLE_NAME
			};
			dynamodb.scan(dynamoParams, done);
			break;
		case "POST":
			const bookId = uuidv4();
			dynamoParams = {
				Item: AWS.DynamoDB.Converter.marshall({
					...payload,
					id: bookId
				}),
				TableName: TABLE_NAME
			};
			dynamodb.putItem(dynamoParams, done);
			break;
		case "PUT":
			dynamoParams = {
				Key: AWS.DynamoDB.Converter.marshall({
					id
				}),
				TableName: TABLE_NAME
			};
			dynamodb.getItem(dynamoParams, (err, data) => {
				// get the item details returned by dynamo
				const retrievedItem = AWS.DynamoDB.Converter.unmarshall(data.Item);
				// creates a new item (the update)
				const newItem = {
					...retrievedItem,
					...payload,
					id
				};
				// now execute the update on dynamo with the new item
				dynamodb.putItem({
					Item: AWS.DynamoDB.Converter.marshall(newItem),
					TableName: TABLE_NAME
				}, done);
			});
			break;
		default:
			done(new Error(`Unsupported method "${event.httpMethod}"`));
	}
};