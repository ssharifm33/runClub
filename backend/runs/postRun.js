const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const userId = event.requestContext.authorizer.claims.sub;

  let data;
  try {
    if (event.body) {
      data = JSON.parse(event.body);
    } else {
      throw new Error('Event body is undefined');
    }
  } catch (error) {
    console.error('Error parsing event body:', error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add this line
      },
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }

  const params = {
    TableName: 'Runs',
    Item: {
      userId; userId,
      runId: uuidv4(),
      date: data.date,
      distance: parseFloat(data.distance),
      time: parseFloat(data.time),
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add this line
      },
      body: JSON.stringify({ status: 'success', run: params.Item }),
    };
  } catch (error) {
    console.error('Error saving run:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add this line
      },
      body: JSON.stringify({ message: 'Error saving run' }),
    };
  }
};
