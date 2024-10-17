const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  // Parse the request body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Validate input data
  if (!data.name || !data.distance) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Route name and distance are required' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Create a new route item
  const routeItem = {
    id: uuidv4(),
    name: data.name,
    distance: data.distance,
    // Include additional attributes if needed
  };

  const params = {
    TableName: 'Routes',
    Item: routeItem,
  };

  try {
    // Save the new route to the Routes table
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ status: 'success', route: routeItem }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error saving route:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving route' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
