const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: 'Routes',
  };

  try {
    // Scan the Routes table to retrieve all items
    const data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error fetching routes:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching routes' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
